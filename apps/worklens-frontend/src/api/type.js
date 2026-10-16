import api from "./axios";

export const getTypes = async () => {
  const response = await api.get("/type");
  return response.data;
};

export const createType = async (type) => {
  const response = await api.post("/type", type);
  return response.data;
};

export const updateType = async (type) => {
  const response = await api.put("/type", type);
  return response.data;
};

export const updateGeneralType = async (typeId) => {
  const response = await api.post(`/type/general/${typeId}`);
  return response.data;
};

export const getCommonTypes = async () => {
  const response = await api.get("/type/common");
  return response.data;
};
