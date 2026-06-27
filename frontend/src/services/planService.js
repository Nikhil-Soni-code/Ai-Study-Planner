import { apiRequest } from "./api";

export async function generatePlanService(planData) {
  return apiRequest("/api/plan", {
    method: "POST",
    body: JSON.stringify(planData),
  });
}

export async function fetchPlansService() {
  return apiRequest("/api/plans", {
    method: "GET",
  });
}

export async function fetchPlanByIdService(id) {
  return apiRequest(`/api/plans/${id}`, {
    method: "GET",
  });
}

export async function deletePlanService(id) {
  return apiRequest(`/api/plans/${id}`, {
    method: "DELETE",
  });
}
