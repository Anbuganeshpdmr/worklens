import apiClient from "./axios";

export async function getCategories() {
  const response = await apiClient.get("/category");
  return response.data;
}

export const createCategory = async (category) => {
  const response = await apiClient.post("/category", category);
  return response.data;
};

export const updateCategory = async (category) => {
  const response = await apiClient.put("/category", category);
  return response.data;
};

export const updateWorkCategory = async (categoryId) => {
  const response = await apiClient.post(`/category/work/${categoryId}`);
  return response.data;
};

export async function getCommonCategories() {
  const response = await apiClient.get("/category/common");
  return response.data;
}
