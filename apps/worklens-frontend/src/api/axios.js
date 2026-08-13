import axios from "axios";

const apiBase = import.meta.env.VITE_API_URL || (typeof window !== "undefined" ? window.location.origin : undefined);

const apiClient = axios.create({
  baseURL: apiBase,
  timeout: 10000,
  headers: { Accept: "application/json" },
});

// Attach JWT token to every request if present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // Log outgoing requests for debugging network issues
    try {
      console.debug("API Request:", config.method?.toUpperCase(), config.baseURL + config.url, config.data || config.params || {});
    } catch (e) {}
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => {
    try {
      console.debug("API Response:", response.status, response.config.url, response.data);
    } catch (e) {}
    return response;
  },
  (error) => {
    try {
      console.error("API Error:", error?.response?.status, error?.config?.url, error?.response?.data || error.message);
    } catch (e) {}
    return Promise.reject(error);
  }
);

export default apiClient;
