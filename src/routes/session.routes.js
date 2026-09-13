import express from "express";

import {
  createSession,
  getSession,
  processEvent,
  getSessionHistory,
  heartbeat,
  terminateSession
} from "../controllers/session.controller.js";

import auth from "../middleware/auth.js";
import sessionAuth from "../middleware/session-auth.js";

const router = express.Router();

router.use(auth);

/**
 * @swagger
 * tags:
 *   - name: Security Sessions
 *     description: Security session management
 *   - name: Security Events
 *     description: Security event processing
 *   - name: Monitoring
 *     description: Session monitoring
 *   - name: Security History
 *     description: Security audit history
 */

/**
 * @swagger
 * /api/v1/security/sessions:
 *   post:
 *     summary: Create security session
 *     tags:
 *       - Security Sessions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attemptId
 *               - candidateId
 *               - examId
 *               - policyId
 *               - policyVersion
 *             properties:
 *               attemptId:
 *                 type: string
 *                 example: ATT-1001
 *               candidateId:
 *                 type: string
 *                 example: CAND-101
 *               examId:
 *                 type: string
 *                 example: EXAM-01
 *               policyId:
 *                 type: string
 *                 example: POLICY-01
 *               policyVersion:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Security session created successfully
 *       400:
 *         description: Invalid request
 *       404:
 *         description: Policy not found
 */
router.post(
  "/",
  createSession
);

/**
 * @swagger
 * /api/v1/security/sessions/{sessionId}/history:
 *   get:
 *     summary: Get security session history
 *     tags:
 *       - Security History
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         example: SEC-1789139290415
 *     responses:
 *       200:
 *         description: Security history retrieved successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Security session not found
 */
router.get(
  "/:sessionId/history",
  sessionAuth,
  getSessionHistory
);

/**
 * @swagger
 * /api/v1/security/sessions/{sessionId}/events:
 *   post:
 *     summary: Submit security event
 *     tags:
 *       - Security Events
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         example: SEC-1789139290415
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - eventId
 *               - eventType
 *               - clientType
 *             properties:
 *               eventId:
 *                 type: string
 *                 example: EVT-101
 *               eventType:
 *                 type: string
 *                 enum:
 *                   - TAB_SWITCH
 *                   - FULLSCREEN_EXIT
 *                   - CAMERA_FACE_NOT_DETECTED
 *                   - HEARTBEAT
 *                 example: TAB_SWITCH
 *               clientType:
 *                 type: string
 *                 example: WEB
 *               occurredAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-09-12T10:00:00Z
 *               metadata:
 *                 type: object
 *                 example: {}
 *     responses:
 *       200:
 *         description: Security event processed successfully
 *       400:
 *         description: Invalid security event
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Security session not found
 */
router.post(
  "/:sessionId/events",
  sessionAuth,
  processEvent
);

/**
 * @swagger
 * /api/v1/security/sessions/{sessionId}/heartbeat:
 *   post:
 *     summary: Send session heartbeat
 *     tags:
 *       - Monitoring
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         example: SEC-1789139290415
 *     responses:
 *       200:
 *         description: Heartbeat processed successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Security session not found
 */
router.post(
  "/:sessionId/heartbeat",
  sessionAuth,
  heartbeat
);

/**
 * @swagger
 * /api/v1/security/sessions/{sessionId}/terminate:
 *   post:
 *     summary: Terminate security session
 *     tags:
 *       - Security Sessions
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         example: SEC-1789139290415
 *     responses:
 *       200:
 *         description: Security session terminated successfully
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Security session not found
 */
router.post(
  "/:sessionId/terminate",
  sessionAuth,
  terminateSession
);

/**
 * @swagger
 * /api/v1/security/sessions/{sessionId}:
 *   get:
 *     summary: Get current security session status
 *     tags:
 *       - Security Sessions
 *     parameters:
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *         example: SEC-1789139290415
 *     responses:
 *       200:
 *         description: Current security session status
 *       403:
 *         description: Not authorized
 *       404:
 *         description: Security session not found
 */
router.get(
  "/:sessionId",
  sessionAuth,
  getSession
);

export default router;