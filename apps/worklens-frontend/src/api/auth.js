import apiClient from "./axios";

/**
 * Calls POST /login with { identifier, password }.
 * On success:
 *   - Reads JWT from the `Authorization` response header → stored as "token" in localStorage
 *   - Reads the full UserInfoDto from the response body → stored as "userInfo" in localStorage
 *
 * @returns {Promise<object>} the UserInfoDto object
 * @throws {Error} with a user-friendly message on failure
 */
export async function login(identifier, password) {
  try {
    const response = await apiClient.post("/login", { identifier, password });

    // JWT comes in the Authorization response header
    const authHeader =
      response.headers["authorization"] ||
      response.headers["Authorization"] ||
      "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : authHeader;

    if (!token) {
      throw new Error("Authentication succeeded but no token was received.");
    }

    // Full UserInfoDto is the response body
    const userInfo = response.data;

    localStorage.setItem("token", token);
    localStorage.setItem("userInfo", JSON.stringify(userInfo));

    return userInfo;
  } catch (error) {
    if (error.response) {
      const status = error.response.status;
      if (status === 401 || status === 403) {
        throw new Error("Invalid credentials. Please check your User ID and password.");
      }
      if (status === 404) {
        throw new Error("User not found. Please check your User ID.");
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
