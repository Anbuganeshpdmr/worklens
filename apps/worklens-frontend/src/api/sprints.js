import apiClient from "./axios";

export async function getSprints() {
  const response = await apiClient.get("/sprints");
  return {
    sprints: Array.isArray(response.data) ? response.data : [],
  };
}
export async function createSprint(projectId, sprintName) {
  const response = await apiClient.post("/sprints", {
    projectId: Number(projectId),
    sprintName,
  });
  return response.data;
}

export async function updateSprint(sprintId, sprintData) {
  return apiClient.put(`/sprints/${sprintId}`, sprintData);
}

export async function getStatusByRecord(recordName) {
  const response = await apiClient.get(`/status/records/${recordName}/applicable`);
  return Array.isArray(response.data) ? response.data : [];
}

export async function getIndividualSprintDetails(sprintId) {
  const response = await apiClient.get(`/sprints/${sprintId}`);
  return response.data;
}
