import apiClient from "./axios";

export async function getActiveProjects() {
  try {
    const response = await apiClient.get("/projects/active");
    return response.data;
  } catch (error) {
    throw buildError(error);
  }
}

export async function getActiveSprints() {
  try {
    const response = await apiClient.get("/sprints/active");
    return response.data;
  } catch (error) {
    throw buildError(error);
  }
}

function buildError(error) {
  if (error.response) {
    const status = error.response.status;
    if (status === 401 || status === 403) {
      return new Error("Session expired. Please log in again.");
    }
    if (status === 404) {
      return new Error("Resource not found.");
    }
    if (status >= 500) {
      return new Error("Server error. Please try again later.");
    }
  }
  if (error.request) {
    return new Error("Unable to reach the server. Please check your network connection.");
  }
  return error;
}
