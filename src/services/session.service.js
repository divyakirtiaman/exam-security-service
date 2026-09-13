import {
  createSession,
  findBySessionId,
  updateSessionStatus
} from "../repositories/session.repository.js";

import {
  createEvent,
  findEventById,
  findEventsBySessionId
} from "../repositories/event.repository.js";

import {
  createViolation,
  findViolationsBySessionId
} from "../repositories/violation.repository.js";

import {
  createAction,
  findActionsBySessionId
} from "../repositories/action.repository.js";

import {
  findPolicy
} from "../repositories/policy.repository.js";

import { redisClient } from "../config/redis.js";

import {
  evaluateViolation
} from "../policies/policy-engine.js";

import AppError from "../utils/errors.js";

import validateSecurityEvent
  from "../validators/security-event.validator.js";


const processHeartbeat = async (
  sessionId
) => {

  const session =
    await findBySessionId(
      sessionId
    );

  if (!session) {
    throw new AppError(
      "Security session not found",
      404,
      "SESSION_NOT_FOUND"
    );
  }

 if (
  session.status === "TERMINATED" ||
  session.status === "LOCKED"
) {
  throw new AppError(
    `Security session is already ${session.status.toLowerCase()}`,
    409,
    "SESSION_CLOSED"
  );
}

  const redisKey =
    `security:session:${sessionId}`;

  const heartbeatTime =
    new Date().toISOString();

  await redisClient.hSet(
    redisKey,
    {
      lastHeartbeat:
        heartbeatTime
    }
  );

  return {
    sessionId,
    status:
      session.status,
    lastHeartbeat:
      heartbeatTime
  };
};


const terminateSecuritySession = async (
  sessionId
) => {

  const session =
    await findBySessionId(
      sessionId
    );

  if (!session) {
    throw new AppError(
      "Security session not found",
      404,
      "SESSION_NOT_FOUND"
    );
  }

  if (
    session.status === "TERMINATED"
  ) {
    throw new AppError(
      "Security session is already terminated",
      409,
      "SESSION_TERMINATED"
    );
  }

  const endedAt =
    new Date();

  const updatedSession =
    await updateSessionStatus(
      sessionId,
      "TERMINATED",
      endedAt
    );

  const redisKey =
    `security:session:${sessionId}`;

  await redisClient.hSet(
    redisKey,
    {
      status: "TERMINATED",
      graceExpiresAt: "",
      endedAt:
        endedAt.toISOString()
    }
  );

  return {
    sessionId:
      updatedSession.sessionId,

    status:
      updatedSession.status,

    endedAt:
      updatedSession.endedAt
  };
};


const createSecuritySession = async ({
  attemptId,
  candidateId,
  examId,
  policyId,
  policyVersion
}) => {

  if (
    !attemptId ||
    !candidateId ||
    !examId ||
    !policyId ||
    policyVersion === undefined
  ) {
    throw new AppError(
      "Required fields are missing",
      400,
      "VALIDATION_ERROR"
    );
  }

  const policy =
    await findPolicy(
      policyId,
      policyVersion
    );

  if (!policy) {
    throw new AppError(
      "Security policy not found",
      404,
      "POLICY_NOT_FOUND"
    );
  }

  const sessionId =
    `SEC-${Date.now()}`;

  const session =
    await createSession({

      sessionId,

      attemptId,

      candidateId,

      examId,

      policyId,

      policyVersion,

      status: "ACTIVE"

    });

  const redisKey =
    `security:session:${sessionId}`;

  await redisClient.hSet(
    redisKey,
    {
      status: "ACTIVE",

      tabSwitch: "0",

      fullscreenExit: "0",

      cameraFaceNotDetected: "0",

      lastHeartbeat: "",

      graceExpiresAt: ""
    }
  );

  return session;
};


const getSecuritySession = async (
  sessionId
) => {

  await checkGracePeriodExpiry(
    sessionId
  );

  const redisKey =
    `security:session:${sessionId}`;

  const liveState =
    await redisClient.hGetAll(
      redisKey
    );

  if (
    !liveState ||
    Object.keys(liveState).length === 0
  ) {
    throw new AppError(
      "Security session not found",
      404,
      "SESSION_NOT_FOUND"
    );
  }

  return {

    sessionId,

    status:
      liveState.status,

    violations: {

      TAB_SWITCH:
        Number(
          liveState.tabSwitch
        ),

      FULLSCREEN_EXIT:
        Number(
          liveState.fullscreenExit
        ),

      CAMERA_FACE_NOT_DETECTED:
        Number(
          liveState.cameraFaceNotDetected
        )

    },

    lastHeartbeat:
      liveState.lastHeartbeat || null,

    graceExpiresAt:
      liveState.graceExpiresAt || null

  };
};


const processSecurityEvent = async ({
  sessionId,
  eventId,
  eventType,
  clientType,
  occurredAt,
  metadata
}) => {

  validateSecurityEvent({
    eventId,
    eventType,
    clientType,
    occurredAt,
    metadata
  });

  const session =
    await findBySessionId(
      sessionId
    );

  if (!session) {
    throw new AppError(
      "Security session not found",
      404,
      "SESSION_NOT_FOUND"
    );
  }

  if (
  session.status === "TERMINATED" ||
  session.status === "LOCKED"
) {
  throw new AppError(
    `Security session is already ${session.status.toLowerCase()}`,
    409,
    "SESSION_CLOSED"
  );
}

  const existingEvent =
    await findEventById(
      eventId
    );

  if (existingEvent) {

    return {

      duplicate: true,

      event: existingEvent,

      action: "NO_ACTION"

    };

  }

  const event =
    await createEvent({

      eventId,

      sessionId,

      eventType,

      clientType,

      occurredAt,

      metadata

    });

  if (
    eventType === "HEARTBEAT"
  ) {

    const redisKey =
      `security:session:${sessionId}`;

    await redisClient.hSet(
      redisKey,
      {
        lastHeartbeat:
          new Date(
            occurredAt
          ).toISOString()
      }
    );

    return {

      duplicate: false,

      event,

      action: "NO_ACTION"

    };

  }

  const redisKey =
    `security:session:${sessionId}`;

  const redisFieldMap = {

    TAB_SWITCH:
      "tabSwitch",

    FULLSCREEN_EXIT:
      "fullscreenExit",

    CAMERA_FACE_NOT_DETECTED:
      "cameraFaceNotDetected"

  };

  const redisField =
    redisFieldMap[eventType];

  if (!redisField) {

    return {

      duplicate: false,

      event,

      action: "NO_ACTION"

    };

  }

  const violationCount =
    await redisClient.hIncrBy(
      redisKey,
      redisField,
      1
    );

  const policy =
    await findPolicy(
      session.policyId,
      session.policyVersion
    );

  if (!policy) {
    throw new AppError(
      "Security policy not found",
      404,
      "POLICY_NOT_FOUND"
    );
  }

  const rule =
    policy.rules[eventType];

  const decision =
    evaluateViolation({

      rule,

      violationCount

    });

  const violationId =
    `VIO-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;

  const violation =
    await createViolation({

      violationId,

      sessionId,

      eventId,

      violationType:
        eventType,

      count:
        violationCount,

      detectedAt:
        new Date(occurredAt)

    });

  let graceExpiresAt =
    null;

  if (
    decision.action === "WARNING"
  ) {

    await redisClient.hSet(
      redisKey,
      {
        status: "WARNING",
        graceExpiresAt: ""
      }
    );

    await updateSessionStatus(
      sessionId,
      "WARNING"
    );

  }

  if (
    decision.action === "GRACE"
  ) {

    graceExpiresAt =
      new Date(
        Date.now() +
        decision.graceSeconds * 1000
      );

    await redisClient.hSet(
      redisKey,
      {
        status: "GRACE",

        graceExpiresAt:
          graceExpiresAt.toISOString()
      }
    );

    await updateSessionStatus(
      sessionId,
      "GRACE"
    );

  }

  if (
    decision.action === "LOCK"
  ) {

    await redisClient.hSet(
      redisKey,
      {
        status: "LOCKED",
        graceExpiresAt: ""
      }
    );

    await updateSessionStatus(
      sessionId,
      "LOCKED"
    );

  }

  if (
    decision.action === "TERMINATE"
  ) {

    const endedAt =
      new Date();

    await redisClient.hSet(
      redisKey,
      {
        status: "TERMINATED",

        graceExpiresAt: "",

        endedAt:
          endedAt.toISOString()
      }
    );

    await updateSessionStatus(
      sessionId,
      "TERMINATED",
      endedAt
    );

  }

  let actionRecord =
    null;

  if (
    decision.action !== "NO_ACTION"
  ) {

    const actionId =
      `ACT-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

    actionRecord =
      await createAction({

        actionId,

        sessionId,

        eventId,

        violationType:
          eventType,

        action:
          decision.action,

        graceSeconds:
          decision.graceSeconds,

        executedAt:
          new Date()

      });

  }

  return {

    duplicate: false,

    event,

    violation,

    action:
      actionRecord,

    currentViolationCount:
      violationCount,

    graceExpiresAt

  };
};


const getSecuritySessionHistory = async (
  sessionId
) => {

  await checkGracePeriodExpiry(
    sessionId
  );

  const session =
    await findBySessionId(
      sessionId
    );

  if (!session) {
    throw new AppError(
      "Security session not found",
      404,
      "SESSION_NOT_FOUND"
    );
  }

  const events =
    await findEventsBySessionId(
      sessionId
    );

  const violations =
    await findViolationsBySessionId(
      sessionId
    );

  const actions =
    await findActionsBySessionId(
      sessionId
    );

  const history = [

    ...events.map((event) => ({

      type: "EVENT",

      timestamp:
        event.createdAt,

      data:
        event

    })),

    ...violations.map((violation) => ({

      type: "VIOLATION",

      timestamp:
        violation.createdAt,

      data:
        violation

    })),

    ...actions.map((action) => ({

      type: "ACTION",

      timestamp:
        action.createdAt,

      data:
        action

    }))

  ];

  history.sort(
    (a, b) =>
      new Date(a.timestamp) -
      new Date(b.timestamp)
  );

  return {

    sessionId,

    status:
      session.status,

    startedAt:
      session.startedAt,

    endedAt:
      session.endedAt,

    history

  };
};


const checkGracePeriodExpiry = async (
  sessionId
) => {

  const redisKey =
    `security:session:${sessionId}`;

  const liveState =
    await redisClient.hGetAll(
      redisKey
    );

  if (
    !liveState ||
    Object.keys(liveState).length === 0
  ) {

    throw new AppError(
      "Security session not found",
      404,
      "SESSION_NOT_FOUND"
    );

  }

  if (
    liveState.status !== "GRACE" ||
    !liveState.graceExpiresAt
  ) {

    return {

      expired: false,

      status:
        liveState.status

    };

  }

  const now =
    Date.now();

  const graceExpiresAt =
    new Date(
      liveState.graceExpiresAt
    ).getTime();

  if (
    now < graceExpiresAt
  ) {

    return {

      expired: false,

      status: "GRACE",

      graceExpiresAt:
        liveState.graceExpiresAt

    };

  }

  await redisClient.hSet(
    redisKey,
    {
      status: "LOCKED",
      graceExpiresAt: ""
    }
  );

  await updateSessionStatus(
    sessionId,
    "LOCKED"
  );

  return {

    expired: true,

    status: "LOCKED"

  };
};


export {
  createSecuritySession,
  getSecuritySession,
  processSecurityEvent,
  getSecuritySessionHistory,
  processHeartbeat,
  terminateSecuritySession,
  checkGracePeriodExpiry
};