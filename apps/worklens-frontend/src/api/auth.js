import apiClient from "./axios";

/**
 * Login using identifier and password.
 * Stores token and user information on success.
 */
export async function login(identifier, password) {
  const response = await apiClient.post("/login", {
    identifier,
    password,
  });

  const authHeader =
    response.headers["authorization"] ||
    response.headers["Authorization"] ||
    "";

  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  if (!token) {
    throw new Error(
      "Authentication succeeded but no token was received.",
    );
  }

  const userInfo = response.data;

  localStorage.setItem("token", token);
  localStorage.setItem("userInfo", JSON.stringify(userInfo));

  return userInfo;
}