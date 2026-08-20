import apiClient from "./axios";

/* ─────────────────────────────────────────────────────────────
   SPRINT-ACTIVITY API
   Base domain: sprint activities that belong to a specific sprint
───────────────────────────────────────────────────────────── */

/**
 * GET /sprint_activity/sprint/{sprintId}
 * List all sprint-activities for a sprint (paginated).
 */
export async function getSprintActivities(sprintId, params = {}) {
  try {
    const response = await apiClient.get(`/sprint_activity/sprint/${sprintId}`, { params });
    console.log(response)
    return response.data;
  } catch (error) {
    throw buildError(error);
  }
}

/**
 * GET /sprint_activity/{sprintActivityId}/children
 * List child scenarios under a parent sprint-activity.
 */
export async function getSprintActivityChildren(sprintActivityId) {
  try {
    const response = await apiClient.get(`/sprint_activity/${sprintActivityId}/children`);
    return response.data;
  } catch (error) {
    throw buildError(error);
  }
}

/**
 * PUT /sprint_activity/{sprintActivityId}
 * Update editable fields of a sprint-activity.
 */
export async function updateSprintActivity(sprintActivityId, payload) {
  try {
    const response = await apiClient.put(`/sprint_activity/${sprintActivityId}`, payload);
    return response.data;
  } catch (error) {
    throw buildError(error);
  }
}

/* ─────────────────────────────────────────────────────────────
   ACTIVITY API
   Base domain: project-level activities (management page — UI TBD)
───────────────────────────────────────────────────────────── */

/**
 * GET /activity
 * List all activities for a project.
 * TODO: confirm full endpoint and query params with backend.
 */
export async function getActivities(params = {}) {
  try {
    const response = await apiClient.get(`/activity`, { params });
    return response.data;
  } catch (error) {
    throw buildError(error);
  }
}

/* ── shared error normaliser ─────────────────────────────────── */
function buildError(error) {
  if (error.response) {
    const status = error.response.status;
    if (status === 401 || status === 403)
      return new Error("Session expired. Please log in again.");
    if (status === 404)
      return new Error("Resource not found.");
    if (status >= 500)
      return new Error("Server error. Please try again later.");
  }
  if (error.request)
    return new Error("Unable to reach the server. Please check your network connection.");
  return error;
}
