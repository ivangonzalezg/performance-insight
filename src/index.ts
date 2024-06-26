import express from "express";
import router from "./routes";
import "./axiosInterceptors";
import { initializeDb } from "./database";

const app = express();
const PORT = process.env.PORT || 7891;

app.use(express.json());

app.use(express.static("public"));

app.use("/api", router);

app.get("/", (req, res) => {
  res.send("Performance Insight");
});

initializeDb().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
});
