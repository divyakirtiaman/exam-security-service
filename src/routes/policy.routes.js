import express from "express";

import auth from "../middleware/auth.js";
import adminAuth from "../middleware/admin-auth.js";

import {
  createSecurityPolicy,
  getAllSecurityPolicies,
  getSecurityPolicy,
  updateSecurityPolicy
} from "../controllers/policy.controller.js";

const router = express.Router();

router.use(auth);

router.post(
  "/",
  adminAuth,
  createSecurityPolicy
);

router.get(
  "/",
  getAllSecurityPolicies
);

router.get(
  "/:policyId/:version",
  getSecurityPolicy
);

router.put(
  "/:policyId/:version",
  adminAuth,
  updateSecurityPolicy
);

export default router;