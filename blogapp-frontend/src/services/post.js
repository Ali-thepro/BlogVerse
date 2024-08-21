import axios from "axios";
const BASE_URL = "/api/posts";

export const createPostInDB = async (post) => { 
  const response = await axios.post(`${BASE_URL}/create`, post);
  return response.data;
}

export const getPostsFromDB = async (query = '') => {
  const response = await axios.get(`${BASE_URL}/getposts${query}`);
  return response.data;
};

export const deletePostFromDB = async (postId, userId) => { 
  const response = await axios.delete(`${BASE_URL}/delete/${postId}`);
  return response.data;
}

export const editPostInDB = async (postId, post) => { 
  const response = await axios.put(`${BASE_URL}/edit/${postId}`, post);
  return response.data;
}

export const getCategories = async () => {
  const response = await axios.get(`${BASE_URL}/categories`);
  return response.data;
}

export const likePostInDB = async (postId) => { 
  const response = await axios.put(`${BASE_URL}/likepost/${postId}`);
  return response.data;
}