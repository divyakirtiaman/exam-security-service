import SecuritySession from "../models/SecuritySession.js";
import AppError from "../utils/errors.js";

const sessionAuth = async (req, res, next) => {
  const { sessionId } = req.params;

  const session = await SecuritySession.findOne({
    sessionId
  });

  if (!session) {
    throw new AppError(
      "Security session not found",
      404,
      "SESSION_NOT_FOUND"
    );
  }

  if (req.user.role === "ADMIN") {
    req.securitySession = session;
    return next();
  }

  if (
    req.user.role === "CANDIDATE" &&
    req.user.candidateId === session.candidateId
  ) {
    req.securitySession = session;
    return next();
  }

  throw new AppError(
    "You are not authorized to access this security session",
    403,
    "FORBIDDEN"
  );
};

export default sessionAuth;