import mongoose from "mongoose";

const securitySessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    attemptId: {
      type: String,
      required: true,
      index: true
    },

    candidateId: {
      type: String,
      required: true,
      index: true
    },

    examId: {
      type: String,
      required: true,
      index: true
    },

    policyId: {
      type: String,
      required: true
    },

    policyVersion: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "WARNING",
        "GRACE",
        "LOCKED",
        "TERMINATED"
      ],
      default: "ACTIVE"
    },

    startedAt: {
      type: Date,
      default: Date.now
    },

    endedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const SecuritySession = mongoose.model(
  "SecuritySession",
  securitySessionSchema
);

export default SecuritySession;