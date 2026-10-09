import api from "./axios";

// GET PROFILE (logged-in user)
export const getProfile = async () => {
  const response = await api.get("/profile");
  return response.data;
};

// GET ALL USERS
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

// CREATE USER
export const addUser = async (userData) => {
  const response = await api.post("/user", userData);
  return response.data;
};

// UPDATE USER
export const updateUser = async (id, userData) => {
  const response = await api.put(`/user/${id}`, userData);
  return response.data;
};

export const getRoles = async () => {
  const response = await api.get(`/roles`);
  return response.data;
};

// GET MEMBER STATUSES
export const getMemberStatuses = async () => {
  const response = await api.get("/records/MEMBER/allowed");
  return response.data;
};

// DELETE USER
export const deleteUser = async (id) => {
  const response = await api.delete(`/user/${id}`);
  return response.data;
};

// CHANGE PASSWORD
export const changePassword = async (passwordData) => {
  const response = await api.post("/me/password", passwordData);
  return response.data;
};

// UPLOAD / REMOVE PROFILE PHOTO (own)
// POST /user/me/dp
// Send file under field "profilePic"; omit it to remove.
// Backend returns the updated user object.
export const uploadProfilePhoto = async (file) => {
  const formData = new FormData();
  formData.append("isDpChanged", "true");
  if (file) formData.append("profilePic", file);
  const response = await api.post("/user/me/dp", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data; // updated user object
};

// FETCH OWN PROFILE PHOTO AS BLOB
// GET /user/me/dp  (auth-protected)
export const getMyDp = async (dpPath) => {
  const response = await api.get(`/dp/${dpPath}`, { responseType: "blob" });
  return response.data;
};

export const fetchProfileData = async () => {
  const res = await api.get("/me");
  return res.data;
}
