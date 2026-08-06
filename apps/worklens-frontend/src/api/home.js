import apiClient from "./axios";

/**
 * Calls GET /home.
 * JWT is attached automatically by the axios request interceptor.
 *
 * @returns {Promise<object>} home page data from the server
 * @throws {Error} with a user-friendly message on failure
 */
export async function getHome() {
  try {
    const response = await apiClient.get("/home");
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
    }
    if (error.request) {
      throw new Error("Unable to reach the server. Please check your network connection.");
    }
    throw error;
  }
}
