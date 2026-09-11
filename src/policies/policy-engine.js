const evaluateViolation = ({
  rule,
  violationCount
}) => {
  if (!rule || !rule.enabled) {
    return {
      action: "NO_ACTION",
      graceSeconds: 0
    };
  }

  if (violationCount >= rule.maxViolations) {
    return {
      action: rule.action,
      graceSeconds: 0
    };
  }

  if (violationCount === 1) {
    return {
      action: "WARNING",
      graceSeconds: 0
    };
  }

  if (rule.graceSeconds > 0) {
    return {
      action: "GRACE",
      graceSeconds: rule.graceSeconds
    };
  }

  return {
    action: "WARNING",
    graceSeconds: 0
  };
};

export {
  evaluateViolation
};