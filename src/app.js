import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger.js";
import sessionRoutes from "./routes/session.routes.js";
import policyRoutes from "./routes/policy.routes.js";
import errorHandler from "./middleware/error-handler.js";

const app = express();

app.use(express.json());

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    service: "exam-security-service",
    status: "UP"
  });
});

app.use(
  "/api/v1/security/sessions",
  sessionRoutes
);

app.use(
  "/api/v1/security/policies",
  policyRoutes
);

app.use(errorHandler);

export default app;