import apiClient from "./axios";

/**
 * Fetches all active projects.
 * Uses the GET /projects endpoint from backend.
 * Backend returns a List<ProjectDisplayDto> directly.
 *
 * @returns {Promise<Array>} Array of projects
 * @throws {Error} with a user-friendly message on failure
 */
export async function getProjects() {
  try {
    const response = await apiClient.get("/projects");
    // Backend returns array directly, wrap it for consistency
    return { projects: Array.isArray(response.data) ? response.data : [] };
  } catch (error) {
    handleApiError(error, "Failed to fetch projects");
  }
}

/**
 * Creates a new project using query parameter.
 * Uses POST /projects?projectName=<name> endpoint from backend.
 * Backend expects @RequestParam String projectName
 *
 * @param {string} projectName - Name of the new project
 * @returns {Promise<object>} The newly created project (ProjectDisplayDto)
 * @throws {Error} with a user-friendly message on failure
 */
export async function createProject(projectName) {
  try {
    const response = await apiClient.post("/projects", null, {
      params: { projectName },
    });
    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to create project");
  }
}

export async function updateProject(projectId, projectData) {
  try {
    const response = await apiClient.put(
      `/projects/${projectId}`,
      projectData
    );

    return response.data;
  } catch (error) {
    handleApiError(error, "Failed to update project");
  }
}

export async function getAllowedProjectStatuses() {
  try {
    const response = await apiClient.get("/records/PROJECT/allowed");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    handleApiError(error, "Failed to fetch allowed project statuses");
  }
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
    const message = error.response.data?.message || error.response.data?.error || error.response.data?.detail;
    
    if (status === 401 || status === 403) {
      throw new Error("Session expired. Please log in again.");
    }
    if (status === 400) {
      throw new Error(message || "Invalid input. Please check your data.");
    }
    if (status >= 500) {
      const errorMsg = message || `Server error (${status}). Please check the backend logs for details.`;
      throw new Error(errorMsg);
    }
  }
  if (error.request) {
    throw new Error("Unable to reach the server. Please check your network connection.");
  }
  throw new Error(error.message || defaultMessage);
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
