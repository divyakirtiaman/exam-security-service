import mongoose from "mongoose";

const securityActionSchema = new mongoose.Schema(
  {
    actionId: {
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
      required: true
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

    action: {
      type: String,
      enum: [
        "WARNING",
        "GRACE",
        "LOCK",
        "TERMINATE"
      ],
      required: true
    },

    graceSeconds: {
      type: Number,
      default: 0
    },

    executedAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

securityActionSchema.index({
  sessionId: 1,
  executedAt: 1
});

const SecurityAction = mongoose.model(
  "SecurityAction",
  securityActionSchema
);

export default SecurityAction;