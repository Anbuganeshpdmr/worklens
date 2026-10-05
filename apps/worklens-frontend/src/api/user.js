import api from "./axios";

// ==========================================
// GET PROFILE (logged-in user)
// ==========================================

export const getProfile = async () => {
  const response = await api.get("/profile");
  console.log("GET /profile:", response.data);
  return response.data;
};

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
  const response = await api.get(`/roles`);
  console.log("GET /roles:", response.data);
  return response.data;
};
// ==========================================
// GET MEMBER STATUSES
// ==========================================

export const getMemberStatuses = async () => {
  const response = await api.get("/records/MEMBER/allowed");

  console.log("GET /records/MEMBER/allowed:", response.data);

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

// ==========================================
// CHANGE PASSWORD
// ==========================================
export const changePassword = async (passwordData) => {
  const response = await api.post("/me/password", passwordData);
  return response.data;
};

// ==========================================
// UPLOAD / REMOVE PROFILE PHOTO (own)
// POST /user/me/dp
// Send file under field "profilePic"; omit it to remove.
// Backend returns the updated user object.
// ==========================================
export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append("isDpChanged", "true");
  if (file) formData.append("profilePic", file);

  console.log("FormData 1:", formData.get("profilePic"));
  console.log("FormData 2:", formData.get("isDpChanged"));

  const response = await api.post("/user/me/dp", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  console.log("POST /user/me/dp:", response.data);
  return response.data; // updated user object
};

// ==========================================
// FETCH OWN PROFILE PHOTO AS BLOB
// GET /user/me/dp  (auth-protected)
// ==========================================
export const getMyDp = async (dpPath) => {
  const response = await api.get(`/dp/${dpPath}`, { responseType: "blob" });
  return response.data;
};

// ==========================================
// FETCH ANOTHER USER'S PHOTO AS BLOB
// GET /user/{id}/dp  (auth-protected)
// ==========================================
export const getUserDp = async (userId) => {
  const response = await api.get(`/user/${userId}/dp`, { responseType: "blob" });
  return response.data;
};