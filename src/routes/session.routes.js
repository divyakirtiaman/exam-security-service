import express from "express";

import {

  createSession,

  getSession,

  processEvent,

  getSessionHistory,

  heartbeat,

  terminateSession

} from "../controllers/session.controller.js";


const router =
  express.Router();


// =====================================================
// CREATE SESSION
// =====================================================

router.post(
  "/",
  createSession
);


// =====================================================
// GET SESSION HISTORY
// =====================================================

router.get(
  "/:sessionId/history",
  getSessionHistory
);


// =====================================================
// SECURITY EVENTS
// =====================================================

router.post(
  "/:sessionId/events",
  processEvent
);


// =====================================================
// HEARTBEAT
// =====================================================

router.post(
  "/:sessionId/heartbeat",
  heartbeat
);


// =====================================================
// TERMINATE SESSION
// =====================================================

router.post(
  "/:sessionId/terminate",
  terminateSession
);


// =====================================================
// GET SESSION
// =====================================================

router.get(
  "/:sessionId",
  getSession
);


export default router;