import mongoose from "mongoose";

const securityEventSchema = new mongoose.Schema(
  {
    eventId: {
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

    eventType: {
      type: String,
      enum: [
        "TAB_SWITCH",
        "FULLSCREEN_EXIT",
        "CAMERA_FACE_NOT_DETECTED",
        "HEARTBEAT"
      ],
      required: true
    },

    clientType: {
      type: String,
      enum: [
        "WEB",
        "ANDROID",
        "IOS",
        "DESKTOP"
      ],
      required: true
    },

    occurredAt: {
      type: Date,
      required: true
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    }
  },
  {
    timestamps: true
  }
);

securityEventSchema.index({
  sessionId: 1,
  occurredAt: 1
});

const SecurityEvent = mongoose.model(
  "SecurityEvent",
  securityEventSchema
);

export default SecurityEvent;