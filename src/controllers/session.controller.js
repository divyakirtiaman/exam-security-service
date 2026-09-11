import {
  createSecuritySession,
  getSecuritySession,
  processSecurityEvent,
  getSecuritySessionHistory,
  processHeartbeat,
  terminateSecuritySession
} from "../services/session.service.js";


// =====================================================
// CREATE SECURITY SESSION
// =====================================================

const createSession = async (
  req,
  res,
  next
) => {

  try {

    const session =
      await createSecuritySession(
        req.body
      );

    res.status(201).json({

      success: true,

      session

    });

  } catch (error) {

    next(error);

  }

};


// =====================================================
// GET SECURITY SESSION
// =====================================================

const getSession = async (
  req,
  res,
  next
) => {

  try {

    const session =
      await getSecuritySession(
        req.params.sessionId
      );

    res.status(200).json({

      success: true,

      session

    });

  } catch (error) {

    next(error);

  }

};


// =====================================================
// PROCESS SECURITY EVENT
// =====================================================

const processEvent = async (
  req,
  res,
  next
) => {

  try {

    const result =
      await processSecurityEvent({

        sessionId:
          req.params.sessionId,

        eventId:
          req.body.eventId,

        eventType:
          req.body.eventType,

        clientType:
          req.body.clientType,

        occurredAt:
          req.body.occurredAt,

        metadata:
          req.body.metadata

      });

    res.status(200).json({

      success: true,

      result

    });

  } catch (error) {

    next(error);

  }

};


// =====================================================
// GET SESSION HISTORY
// =====================================================

const getSessionHistory = async (
  req,
  res,
  next
) => {

  try {

    const history =
      await getSecuritySessionHistory(
        req.params.sessionId
      );

    res.status(200).json({

      success: true,

      history

    });

  } catch (error) {

    next(error);

  }

};


// =====================================================
// HEARTBEAT
// =====================================================

const heartbeat = async (
  req,
  res,
  next
) => {

  try {

    const result =
      await processHeartbeat(
        req.params.sessionId
      );

    res.status(200).json({

      success: true,

      heartbeat: result

    });

  } catch (error) {

    next(error);

  }

};


// =====================================================
// TERMINATE SESSION
// =====================================================

const terminateSession = async (
  req,
  res,
  next
) => {

  try {

    const result =
      await terminateSecuritySession(
        req.params.sessionId
      );

    res.status(200).json({

      success: true,

      termination: result

    });

  } catch (error) {

    next(error);

  }

};


// =====================================================
// EXPORTS
// =====================================================

export {

  createSession,

  getSession,

  processEvent,

  getSessionHistory,

  heartbeat,

  terminateSession

};