import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { openDb } from "./database";
import { v4 as uuidv4 } from "uuid";

export interface RequestOptions extends AxiosRequestConfig {
  iterations?: number;
  delay?: number;
  virtualUsers?: number;
  duration?: number;
  sessionId?: string;
}

export interface RequestMetrics {
  totalRequests: number;
  requestsPerSecond: number;
  averageResponseTime: number;
  errorPercentage: number;
}

const defaultOptions: Partial<RequestOptions> = {
  iterations: 1,
  delay: 0,
  virtualUsers: 1,
  duration: 60,
};

export const runRequests = async (
  options: RequestOptions
): Promise<{ sessionId: string }> => {
  const finalOptions = Object.assign({}, defaultOptions, options);
  finalOptions.sessionId = finalOptions.sessionId || uuidv4();

  const db = await openDb();
  const startTime = new Date().toISOString();
  await db.run(
    `INSERT INTO session_metrics (session_id, start_time, status) VALUES (?, ?, ?)`,
    finalOptions.sessionId,
    startTime,
    "running"
  );

  setImmediate(async () => {
    const results: AxiosResponse[] = [];
    const errorResponses: AxiosResponse[] = [];
    const startTime = Date.now();
    const endTime = startTime + finalOptions.duration! * 1000;

    let totalRequests = 0;
    let totalTime = 0;

    const runSingleUserRequests = async () => {
      while (Date.now() < endTime) {
        for (let i = 0; i < finalOptions.iterations!; i++) {
          if (Date.now() >= endTime) break;
          try {
            const response = await axios(finalOptions);
            const metadata = (response.config as any).metadata;
            const elapsedTime = metadata.endTime - metadata.startTime;

            results.push(response);
            totalTime += elapsedTime;

            await db.run(
              `INSERT INTO requests (session_id, method, url, headers, data, status, response) VALUES (?, ?, ?, ?, ?, ?, ?)`,
              finalOptions.sessionId,
              finalOptions.method,
              finalOptions.url,
              JSON.stringify(finalOptions.headers),
              JSON.stringify(finalOptions.data),
              response.status,
              JSON.stringify(response.data)
            );
          } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
              errorResponses.push(error.response);
            }
          }
          totalRequests++;
          if (finalOptions.delay! > 0) {
            await new Promise((resolve) =>
              setTimeout(resolve, finalOptions.delay)
            );
          }

          const elapsedTime = (Date.now() - startTime) / 1000;
          const requestsPerSecond = totalRequests / elapsedTime;
          const averageResponseTime = totalRequests
            ? totalTime / totalRequests
            : 0;
          const errorPercentage = (errorResponses.length / totalRequests) * 100;

          await db.run(
            `UPDATE session_metrics SET total_requests = ?, requests_per_second = ?, average_response_time = ?, error_percentage = ?, total_time = ? WHERE session_id = ?`,
            totalRequests,
            requestsPerSecond,
            averageResponseTime,
            errorPercentage,
            totalTime,
            finalOptions.sessionId
          );
        }
      }
    };

    const users = Array.from({ length: finalOptions.virtualUsers! }, () =>
      runSingleUserRequests()
    );

    await Promise.all(users);

    const endTimeActual = new Date().toISOString();
    await db.run(
      `UPDATE session_metrics SET end_time = ?, status = ? WHERE session_id = ?`,
      endTimeActual,
      "finished",
      finalOptions.sessionId
    );
  });

  return { sessionId: finalOptions.sessionId };
};
