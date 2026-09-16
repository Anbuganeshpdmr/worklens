import apiClient from "./axios";

export async function getStatusByRecord(recordName) {
  const response = await apiClient.get(
    `/status/records/${recordName}/applicable`,
  );
  return response.data;
}
