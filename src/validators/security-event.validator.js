import AppError from "../utils/errors.js";

const allowedEventTypes = [
  "TAB_SWITCH",
  "FULLSCREEN_EXIT",
  "CAMERA_FACE_NOT_DETECTED"
];

const validateSecurityEvent = ({
  eventId,
  eventType,
  clientType,
  occurredAt,
  metadata
}) => {
  if (
    typeof eventId !== "string" ||
    eventId.trim() === ""
  ) {
    throw new AppError(
      "eventId is required",
      400,
      "VALIDATION_ERROR"
    );
  }

  if (
    typeof eventType !== "string" ||
    !allowedEventTypes.includes(eventType)
  ) {
    throw new AppError(
      "Invalid eventType",
      400,
      "VALIDATION_ERROR"
    );
  }

  if (
    typeof clientType !== "string" ||
    clientType.trim() === ""
  ) {
    throw new AppError(
      "clientType is required",
      400,
      "VALIDATION_ERROR"
    );
  }

  if (occurredAt !== undefined) {
    const date = new Date(occurredAt);

    if (Number.isNaN(date.getTime())) {
      throw new AppError(
        "occurredAt must be a valid date-time",
        400,
        "VALIDATION_ERROR"
      );
    }
  }

  if (
    metadata !== undefined &&
    (
      typeof metadata !== "object" ||
      metadata === null ||
      Array.isArray(metadata)
    )
  ) {
    throw new AppError(
      "metadata must be an object",
      400,
      "VALIDATION_ERROR"
    );
  }
};

export default validateSecurityEvent;