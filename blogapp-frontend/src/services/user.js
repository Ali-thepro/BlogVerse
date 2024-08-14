import axios from "axios";
const BASE_URL = "api/user";

export const update = async (credentials) => {
  const response = await axios.put(`${BASE_URL}/update/${credentials.id}`, credentials);
  return response.data;
};

