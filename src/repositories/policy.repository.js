import SecurityPolicy from "../models/SecurityPolicy.js";

const findPolicy = async (policyId, version) => {
  return await SecurityPolicy.findOne({
    policyId,
    version,
    active: true
  });
};

export {
  findPolicy
};