import SecuritySession from "../models/SecuritySession.js";


// =====================================================
// CREATE SESSION
// =====================================================

const createSession = async (sessionData) => {

  return await SecuritySession.create(
    sessionData
  );

};


// =====================================================
// FIND SESSION BY SESSION ID
// =====================================================

const findBySessionId = async (sessionId) => {

  return await SecuritySession.findOne({
    sessionId
  });

};


// =====================================================
// UPDATE SESSION STATUS
// =====================================================

const updateSessionStatus = async (
  sessionId,
  status,
  endedAt = null
) => {

  return await SecuritySession.findOneAndUpdate(

    {
      sessionId
    },

    {
      status,
      endedAt
    },

    {
      new: true
    }

  );

};


// =====================================================
// EXPORTS
// =====================================================

export {

  createSession,

  findBySessionId,

  updateSessionStatus

};