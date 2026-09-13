import SecurityPolicy from "../models/SecurityPolicy.js";

const createPolicy = async (policyData) => {
  return await SecurityPolicy.create(policyData);
};

const findPolicy = async (policyId, version) => {
  return await SecurityPolicy.findOne({
    policyId,
    version,
    active: true
  });
};

const findAllPolicies = async () => {
  return await SecurityPolicy.find()
    .sort({ policyId: 1, version: -1 });
};

const findPolicyById = async (policyId, version) => {
  return await SecurityPolicy.findOne({
    policyId,
    version
  });
};

const updatePolicy = async (policyId, version, updateData) => {
  return await SecurityPolicy.findOneAndUpdate(
    {
      policyId,
      version
    },
    updateData,
    {
      new: true,
      runValidators: true
    }
  );
};

export {
  createPolicy,
  findPolicy,
  findAllPolicies,
  findPolicyById,
  updatePolicy
};