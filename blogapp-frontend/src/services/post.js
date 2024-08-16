import axios from "axios";
const BASE_URL = "api/posts";

export const createPostInDB = async (post) => { 
  const response = await axios.post(`${BASE_URL}/create`, post);
  return response.data;
}

export const getPostsFromDB = async () => {
  const response = await axios.get(`${BASE_URL}/getposts`);
  return response.data;
}

export const getPostsByUserFromDB = async () => {
  const response = await axios.get(`${BASE_URL}/getpostbyuser`);
  return response.data;
}