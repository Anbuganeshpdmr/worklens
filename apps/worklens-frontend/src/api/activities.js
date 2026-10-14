import apiClient from "./axios";

/* SPRINT-ACTIVITY API */
export async function getSprintActivities(sprintId, params = {}) {
  const response = await apiClient.get(
    `/sprint_activity/sprint/${sprintId}`,
    { params },
  );
  return response.data;
}

export async function getSprintActivityChildren(sprintActivityId) {
  const response = await apiClient.get(
    `/sprint_activity/${sprintActivityId}/children`,
  );
  return response.data;
}

export async function updateSprintActivity(sprintActivityId, payload) {
  const response = await apiClient.put(
    `/sprint_activity/${sprintActivityId}`,
    payload,
  );
  return response.data;
}

/* ACTIVITY API */
export async function getActivities(params = {}) {
  const response = await apiClient.get("/activity", { params });
  return response.data;
}

export async function getAllProjectActivities(projectId) {
  const response = await apiClient.get(`/activity/project/${projectId}`);
  return response.data;
}

export async function getAllGeneralActivities() {
  const response = await apiClient.get("/activity/general");
  return response.data;
}

export async function createTestActivity(payload) {
  const response = await apiClient.post("/activity/work", payload);
  return response.status;
}

export async function updateTestActivity(payload) {
  const response = await apiClient.put("/activity/work", payload);
  return response.status;
}

export async function createGeneralActivity(payload) {
  const response = await apiClient.post("/activity/general", payload);
  return response;
}

export async function updateGeneralActivity(payload) {
  const response = await apiClient.put("/activity/general", payload);
  return response;
}