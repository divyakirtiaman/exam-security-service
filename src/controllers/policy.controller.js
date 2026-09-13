import {
  createPolicy,
  findAllPolicies,
  findPolicyById,
  updatePolicy
} from "../repositories/policy.repository.js";

import AppError from "../utils/errors.js";

const createSecurityPolicy = async (req, res) => {
  const policy = await createPolicy(req.body);

  res.status(201).json({
    success: true,
    data: policy
  });
};

const getAllSecurityPolicies = async (req, res) => {
  const policies = await findAllPolicies();

  res.status(200).json({
    success: true,
    data: policies
  });
};

const getSecurityPolicy = async (req, res) => {
  const { policyId, version } = req.params;

  const policy = await findPolicyById(
    policyId,
    Number(version)
  );

  if (!policy) {
    throw new AppError(
      "Policy not found",
      404,
      "POLICY_NOT_FOUND"
    );
  }

  res.status(200).json({
    success: true,
    data: policy
  });
};

const updateSecurityPolicy = async (req, res) => {
  const { policyId, version } = req.params;

  const policy = await updatePolicy(
    policyId,
    Number(version),
    req.body
  );

  if (!policy) {
    throw new AppError(
      "Policy not found",
      404,
      "POLICY_NOT_FOUND"
    );
  }

  res.status(200).json({
    success: true,
    data: policy
  });
};

export {
  createSecurityPolicy,
  getAllSecurityPolicies,
  getSecurityPolicy,
  updateSecurityPolicy
};