import apiClient from "./axios";

export async function getAllEntries(entryFilterRequest, page, size) {
  return apiClient.post(
    `/entry/search`,
    {
      entryFilterRequest,
    },
    {
      params: { page, size },
    },
  );
}

export async function startTestActivity(sprintActivityId) {
  return apiClient.post(`/entry/work/${sprintActivityId}`);
}

export async function closeWorkActivity(response) {
  return apiClient.put(`/entry/work`, response);
}

export async function startGeneralActivity(activityId) {
  return apiClient.post(`/entry/general/${activityId}`);
}

export async function closeGeneralActivity(response) {
  return apiClient.put(`/entry/general`, response);
}
