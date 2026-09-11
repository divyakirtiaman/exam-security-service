import SecurityEvent from "../models/SecurityEvent.js";

const createEvent = async (eventData) => {
  return await SecurityEvent.create(eventData);
};

const findEventById = async (eventId) => {
  return await SecurityEvent.findOne({
    eventId
  });
};

const findEventsBySessionId = async (sessionId) => {
  return await SecurityEvent.find({
    sessionId
  }).sort({
    occurredAt: 1
  });
};

export {
  createEvent,
  findEventById,
  findEventsBySessionId
};