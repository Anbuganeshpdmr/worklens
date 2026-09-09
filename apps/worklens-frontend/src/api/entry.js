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
  return apiClient.post(`/entry/test/${sprintActivityId}`);
}

export async function closeTestActivity(response) {
  return apiClient.put(`/entry/test`, response);
}
