import SecurityViolation from "../models/SecurityViolation.js";

const createViolation = async (violationData) => {
  return await SecurityViolation.create(violationData);
};

const findViolationsBySessionId = async (sessionId) => {
  return await SecurityViolation.find({
    sessionId
  }).sort({
    detectedAt: 1
  });
};

export {
  createViolation,
  findViolationsBySessionId
};