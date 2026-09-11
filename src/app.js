import express from "express";
import sessionRoutes from "./routes/session.routes.js";
import errorHandler from "./middleware/error-handler.js";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "exam-security-service",
    status: "UP"
  });
});

app.use("/api/v1/security/sessions", sessionRoutes);

app.use(errorHandler);

export default app;