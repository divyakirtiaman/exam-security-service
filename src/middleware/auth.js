import "dotenv/config";
import AppError from "../utils/errors.js";

const auth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey) {
    throw new AppError(
      "API key is required",
      401,
      "UNAUTHORIZED"
    );
  }

  if (apiKey.trim() === process.env.API_KEY?.trim()) {
    req.user = {
      role: "ADMIN"
    };

    return next();
  }

 if (
  apiKey.trim() ===
  process.env.CANDIDATE_API_KEY?.trim()
) {
  req.user = {
    role: "CANDIDATE",
    candidateId: "CAND-101"
  };

  return next();
}

  throw new AppError(
    "Invalid API key",
    401,
    "UNAUTHORIZED"
  );
};

export default auth;