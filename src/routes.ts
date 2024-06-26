import { Router } from "express";
import { runRequests, RequestOptions } from "./requestRunner";
import { openDb } from "./database";

const router = Router();

router.post("/run", async (req, res) => {
  const options: RequestOptions = req.body;
  try {
    const { sessionId } = await runRequests(options);
    res.json({ sessionId, url: `/api/sessions/${sessionId}` });
  } catch (error: any) {
    res.status(500).send(error.message);
  }
});

router.get("/sessions", async (req, res) => {
  const db = await openDb();
  const sessions = await db.all(`SELECT DISTINCT session_id FROM requests`);
  const sessionUrls = sessions.map((session) => ({
    sessionId: session.session_id,
    url: `/api/sessions/${session.session_id}`,
  }));
  res.json(sessionUrls);
});

router.get("/sessions/:sessionId", async (req, res) => {
  const { sessionId } = req.params;
  const { requests } = req.query;
  const db = await openDb();
  const metrics = await db.get(
    `SELECT * FROM session_metrics WHERE session_id = ?`,
    sessionId
  );
  let _requests = [];
  if (requests === "true") {
    _requests = await db.all(
      `SELECT * FROM requests WHERE session_id = ?`,
      sessionId
    );
  }
  res.json({
    sessionId,
    metrics,
    requests,
  });
});

export default router;
