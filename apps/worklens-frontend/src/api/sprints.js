import apiClient from "./axios";

/**
 * Fetches all active sprints.
 * Uses the GET /sprints endpoint from backend.
 * Backend should return a List<SprintDisplayDto> directly.
 *
 * @returns {Promise<Array>} Array of sprints
 * @throws {Error} with a user-friendly message on failure
 */
export async function getSprints() {
  try {
    const response = await apiClient.get("/sprints");
    // Backend returns array directly, wrap it for consistency
    return { sprints: Array.isArray(response.data) ? response.data : [] };
  } catch (error) {
    handleApiError(error, "Failed to fetch sprints");
  }
}

/**
 * Creates a new sprint using query parameters.
 * Uses POST /sprints endpoint from backend.
 * Backend expects @RequestParam String projectId and @RequestParam String sprintName
 *
 * @param {string} projectId - ID of the project for this sprint
 * @param {string} sprintName - Name of the new sprint
 * @returns {Promise<object>} The newly created sprint (SprintDisplayDto)
 * @throws {Error} with a user-friendly message on failure
 */
export async function createSprint(projectId, sprintName) {
  try {
    const response = await apiClient.post("/sprints", {
      projectId: Number(projectId),
      sprintName: sprintName,
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to create sprint");
  }
}

export async function updateSprint(sprintId, sprintData) {
  try {
    const response = await apiClient.put(`/sprints/${sprintId}`, sprintData);

    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to update sprint");
  }
}

export async function getAllowedSprintStatuses() {
  try {
    const response = await apiClient.get("/status/records/sprint/applicable");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    handleApiError(error, "Failed to fetch allowed sprint statuses");
  }
}

export async function getIndividualSprintDetails(sprintId) {
  const response = await apiClient.get(`/sprints/${sprintId}`);
  return response.data;
}

/**
 * Helper function to handle API errors with user-friendly messages
 *
 * @param {Error} error - The error object from axios
 * @param {string} defaultMessage - Default message if no specific error is caught
 * @throws {Error} with a user-friendly message
 */
function handleApiError(error, defaultMessage) {
  console.error("API Error:", error);
  if (error.response) {
    const status = error.response.status;
    const message =
      error.response.data?.message ||
      error.response.data?.error ||
      error.response.data?.detail;

    if (status === 401 || status === 403) {
      throw new Error("Session expired. Please log in again.");
    }
    if (status === 400) {
      throw new Error(message || "Invalid input. Please check your data.");
    }
    if (status >= 500) {
      const errorMsg =
        message ||
        `Server error (${status}). Please check the backend logs for details.`;
      throw new Error(errorMsg);
    }
  }
  if (error.request) {
    throw new Error(
      "Unable to reach the server. Please check your network connection.",
    );
  }
  throw new Error(error.message || defaultMessage);
}
