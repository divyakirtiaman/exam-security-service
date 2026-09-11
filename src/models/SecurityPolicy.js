import mongoose from "mongoose";

const ruleSchema = new mongoose.Schema(
  {
    enabled: {
      type: Boolean,
      default: true
    },

    maxViolations: {
      type: Number,
      required: true,
      min: 1
    },

    graceSeconds: {
      type: Number,
      default: 0,
      min: 0
    },

    action: {
      type: String,
      enum: ["WARNING", "GRACE", "LOCK", "TERMINATE"],
      required: true
    }
  },
  {
    _id: false
  }
);

const securityPolicySchema = new mongoose.Schema(
  {
    policyId: {
      type: String,
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true
    },

    version: {
      type: Number,
      required: true
    },

    rules: {
      TAB_SWITCH: {
        type: ruleSchema,
        required: true
      },

      FULLSCREEN_EXIT: {
        type: ruleSchema,
        required: true
      },

      CAMERA_FACE_NOT_DETECTED: {
        type: ruleSchema,
        required: true
      }
    },

    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

securityPolicySchema.index(
  { policyId: 1, version: 1 },
  { unique: true }
);

const SecurityPolicy = mongoose.model(
  "SecurityPolicy",
  securityPolicySchema
);

export default SecurityPolicy;