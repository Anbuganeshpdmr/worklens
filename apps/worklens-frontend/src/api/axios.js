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

// Redirect to login on 401
customApiClient.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      window.location.href = "/";
    }

    commonApiErrorHandler(error);
    //return Promise.reject(error);
  },
);

export default customApiClient;
