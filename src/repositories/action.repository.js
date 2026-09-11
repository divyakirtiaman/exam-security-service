import SecurityAction from "../models/SecurityAction.js";

const createAction = async (actionData) => {
  return await SecurityAction.create(actionData);
};

const findActionsBySessionId = async (sessionId) => {
  return await SecurityAction.find({
    sessionId
  }).sort({
    executedAt: 1
  });
};

export {
  createAction,
  findActionsBySessionId
};