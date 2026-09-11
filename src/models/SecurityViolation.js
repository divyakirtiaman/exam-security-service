import mongoose from "mongoose";

const securityViolationSchema = new mongoose.Schema(
  {
    violationId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    sessionId: {
      type: String,
      required: true,
      index: true
    },

    eventId: {
      type: String,
      required: true,
      index: true
    },

    violationType: {
      type: String,
      enum: [
        "TAB_SWITCH",
        "FULLSCREEN_EXIT",
        "CAMERA_FACE_NOT_DETECTED"
      ],
      required: true
    },

    count: {
      type: Number,
      required: true
    },

    detectedAt: {
      type: Date,
      required: true
    }
  },
  {
    timestamps: true
  }
);

securityViolationSchema.index({
  sessionId: 1,
  violationType: 1
});

const SecurityViolation = mongoose.model(
  "SecurityViolation",
  securityViolationSchema
);

export default SecurityViolation;