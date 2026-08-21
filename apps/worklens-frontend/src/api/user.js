
import api, { mockApi } from "./axios";


// ==========================================
// GET ALL USERS
// ==========================================

export const getUsers = async () => {
  
  const response = await api.get("/users");

  console.log("Inside...");
  console.log("GET /users:", response.data);

  return response.data;
};


// ==========================================
// CREATE USER
// ==========================================

export const addUser = async (userData) => {
  const response = await api.post("/user", userData);

  console.log("POST /user:", response.data);

  return response.data;
};


// ==========================================
// UPDATE USER
// ==========================================

export const updateUser = async (id, userData) => {
  const response = await api.put(`/user/${id}`, userData);

  console.log(`PUT /user/${id}:`, response.data);

  return response.data;
};
export const getRoles = async () => {
  const response = await mockApi.get("/");
  console.log("GET /roles (mock):", response.data);
  return response.data;
};
// ==========================================
// DELETE USER
// ==========================================

export const deleteUser = async (id) => {
  const response = await api.delete(`/user/${id}`);

  console.log(`DELETE /user/${id}:`, response.data);

  return response.data;
};