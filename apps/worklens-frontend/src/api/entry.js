//import apiClient from "./axios";
import customApiClient from "./axios";

export async function getAllEntries(entryFilterRequest, page, size) {
  console.log("REQUEST BODY:", JSON.stringify(entryFilterRequest, page, size));
  return customApiClient.post(`/entry/search`, entryFilterRequest, {
    params: { page, size },
  });
}

export async function fetchAllEntries(entryFilterRequest) {
  console.log("REQUEST BODY:", JSON.stringify(entryFilterRequest));
  return customApiClient.post(`/entry/fetch`, entryFilterRequest);
}

export async function startTestActivity(sprintActivityId) {
  return customApiClient.post(`/entry/work/${sprintActivityId}`);
}

export async function closeWorkActivity(request) {
  return customApiClient.put(`/entry/work`, request);
}

export async function startGeneralActivity(activityId) {
  return customApiClient.post(`/entry/general/${activityId}`);
}

export async function closeGeneralActivity(request) {
  return customApiClient.put(`/entry/general`, request);
}

export async function getEntry(id) {
  console.log("Fetching Entry details for ID:", id);
  return customApiClient.get(`/entry/${id}`);
}

export async function getOpenEntry() {
  return customApiClient.get(`/entry/open`);
}

export async function updateEntryPeriod(request) {
  console.log("Updating Entry Period with request:", request);
  return customApiClient.patch(`/entry/period`, request);
}
