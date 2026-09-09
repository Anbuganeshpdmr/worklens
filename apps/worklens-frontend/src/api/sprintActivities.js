import apiClient from "./axios";

export async function updateSprintActivitiesList(
  sprintId,
  requestedActivityIds,
) {
  return apiClient.put(`/sprint_activity/update`, {
    sprintId,
    requestedActivityIds,
  });
}

export async function getSelectedSprintActivityIds(sprintId) {
  const response = await apiClient.get(
    `/sprint_activity/sprint/${sprintId}/list`,
  );
  return response.data;
}

export async function getSelectedSprintActivities(sprintId) {
  const response = await apiClient.get(`/sprint_activity/sprint/${sprintId}`);
  return response.data;
}

export async function getSprintActivity(sprintActivityId) {
  const response = await apiClient.get(`/sprint_activity/${sprintActivityId}`);
  return response.data;
}
