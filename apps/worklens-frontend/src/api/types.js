import apiClient from "./axios";

// export async function getTestCategoryTypes() {
//   const response = await apiClient.get(`/type/test-category`);
//   return response.data;
// }

export async function getTypes() {
  const response = await apiClient.get(`/type`);
  return response.data;
}
