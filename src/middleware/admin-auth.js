import AppError from "../utils/errors.js";

const adminAuth = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    throw new AppError(
      "Admin access required",
      403,
      "FORBIDDEN"
    );
  }

  next();
};

export default adminAuth;