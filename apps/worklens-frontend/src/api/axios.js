import axios from "axios";
import {commonApiErrorHandler} from "./apiErrorHandler";

const customApiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// Attach Bearer token on every request
customApiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers["Authorization"] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// Redirect to login on 401, except when the login request itself fails.
customApiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    const requestPath = error.config?.url?.split("?")[0].replace(/\/+$/, "");
    const isLoginRequest = requestPath === "/login";

    if (error.response?.status === 401 && !isLoginRequest) {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      window.location.href = "/";
    }

    return Promise.reject(commonApiErrorHandler(error));
  },
);

export default customApiClient;
