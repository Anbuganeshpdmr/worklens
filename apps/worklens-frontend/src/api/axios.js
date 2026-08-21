import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Attach Bearer token on every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Redirect to login on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

// Separate instance for Postman mock API (no auth needed)
export const mockApi = axios.create({
  baseURL: "https://06fbcdea-13e8-4fb6-beb9-99571476a02e.mock.pstmn.io",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export default api;

