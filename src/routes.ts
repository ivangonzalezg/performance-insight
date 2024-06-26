import { Router } from "express";
import { runRequests, RequestOptions } from "./requestRunner";
import { openDb } from "./database";

const router = Router();

router.post("/run", async (req, res) => {
  const options: RequestOptions = req.body;
  try {
    const { sessionId } = await runRequests(options);
    res.json({ sessionId });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

router.get("/sessions", async (req, res) => {
  const db = await openDb();
  const sessions = await db.all(
    `SELECT session_id, start_time, end_time, status FROM session_metrics`
  );
  res.json(sessions);
});

router.get("/sessions/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const includeRequests = req.query?.requests === "true";
  const db = await openDb();
  const metrics = await db.get(
    `SELECT * FROM session_metrics WHERE session_id = ?`,
    sessionId
  );
  let requests = [];
  if (includeRequests) {
    requests = await db.all(
      `SELECT * FROM requests WHERE session_id = ?`,
      sessionId
    );
  }
  res.json({
    sessionId,
    metrics,
    requests: includeRequests ? requests : undefined,
  });
});

export default router;
