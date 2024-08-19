import axios from "axios";
const BASE_URL = "/api/user";

export const update = async (credentials) => {
  const response = await axios.put(`${BASE_URL}/update/${credentials.id}`, credentials);
  return response.data;
};

export const deleteUserFromDB = async (id) => { 
  const response = await axios.delete(`${BASE_URL}/delete/${id}`);
  return response.data;
}

export const signOutUserFromDB = async () => {
  const response = await axios.post(`${BASE_URL}/signout`);
  return response.data;
};

export const getUsersFromDB = async (query = '') => { 
  const response = await axios.get(`${BASE_URL}/getusers${query}`);
  return response.data;
}