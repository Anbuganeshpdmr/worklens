import api from "./axios";

export const getStatuses = async () => {
  const response = await api.get("/status/all");

  return response.data;
};

export const getRecordTypes = async () => {
  const response = await api.get("/records");

  return response.data;
};

export const createStatus = async (statusData) => {
  const response = await api.post("/status", statusData);

  return response.data;
};

export const updateStatus = async (statusData) => {
  const response = await api.put("/status/meta", statusData);

  return response.data;
};

export async function getStatusByRecord(recordName) {
  const response = await apiClient.get(
    `/status/records/${recordName}/applicable`,
  );
  return response.Data;
}
