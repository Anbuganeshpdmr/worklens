import apiClient from "./axios";

async function handleRequest(promise) {
  try {
    const response = await promise;
    // backend might wrap payload in different shapes; prefer `data` or `data.statuses`
    if (response.data && response.data.statuses) return response.data.statuses;
    return response.data;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        throw new Error("Session expired. Please log in again.");
      }
      if (status >= 500) {
        throw new Error("Server error. Please try again later.");
      }
      // propagate backend message when available
      throw new Error(error.response.data?.message || "Request failed.");
    }
    if (error.request) {
      throw new Error("Unable to reach the server. Please check your network connection.");
    }
    throw error;
  }
}

export const getRecordTypes = async () =>
  handleRequest(apiClient.get("/records"));

export const getRecordStatuses = async (recordName) =>
  handleRequest(apiClient.get(`/records/${encodeURIComponent(recordName)}`));

export const updateRecordStatuses = async (recordName, statuses) =>
  handleRequest(apiClient.put(`/records/${encodeURIComponent(recordName)}`, statuses));

export const getAllowedRecordStatuses = async (recordName) =>
  handleRequest(apiClient.get(`/records/${encodeURIComponent(recordName)}/allowed`));