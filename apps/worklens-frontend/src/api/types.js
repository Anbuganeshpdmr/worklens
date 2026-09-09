import apiClient from "./axios";

export async function getTestCategoryTypes() {
  const response = await apiClient.get(`/type/test-category`);
  return response.data;
}
