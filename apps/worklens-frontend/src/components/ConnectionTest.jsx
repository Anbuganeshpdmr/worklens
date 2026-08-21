import { useState } from "react";
import api from "../api/axios";

export function ConnectionTest() {
  const [testResult, setTestResult] = useState("");
  const [testing, setTesting] = useState(false);

  const testConnection = async () => {
    setTesting(true);
    setTestResult("Testing connection...");

    try {
      const response = await api.get("/users", { timeout: 5000 });
      setTestResult(
        `✅ Connected! Got ${Array.isArray(response.data) ? response.data.length : "some"} users`
      );
    } catch (error) {
      const msg = error.response?.status
        ? `❌ Server returned ${error.response.status}: ${error.response.statusText}`
        : error.code === "ERR_NETWORK"
        ? "❌ Network Error: Backend not running or wrong port"
        : error.code === "ECONNABORTED"
        ? "❌ Timeout: Server took too long to respond"
        : `❌ Error: ${error.message}`;
      setTestResult(msg);
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={{ padding: "10px", margin: "10px 0", border: "1px solid #ccc", borderRadius: "4px" }}>
      <p>
        <strong>API Base URL:</strong> {import.meta.env.VITE_API_URL || "http://localhost:8080"}
      </p>
      <button onClick={testConnection} disabled={testing}>
        {testing ? "Testing..." : "Test Connection"}
      </button>
      {testResult && <p>{testResult}</p>}
    </div>
  );
}
