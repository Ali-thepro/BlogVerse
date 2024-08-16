import axios from "axios";
const BASE_URL = "api/posts";

export const createPostInDB = async (post) => { 
  const response = await axios.post(`${BASE_URL}/create`, post);
  return response.data;
}