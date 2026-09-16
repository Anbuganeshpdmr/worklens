import apiClient from "./axios";

export async function getCategories() {
  const response = await apiClient.get(`/category`);
  return response.data;
}
