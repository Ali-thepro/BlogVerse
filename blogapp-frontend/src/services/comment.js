import axios from "axios";
const BASE_URL = "/api/comments";

export const createCommentInDB = async (comment) => { 
  const response = await axios.post(`${BASE_URL}/create`, comment);
  return response.data;
}

export const getCommentsInDB = async (query) => { 
  const response = await axios.get(`${BASE_URL}/getcomments${query}`);
  return response.data;
}

export const getPostCommentsInDB = async (postId, query) => { 
  const response = await axios.get(`${BASE_URL}/getpostcomments/${postId}${query}`);
  return response.data;
}

export const likeCommentInDB = async (commentId) => { 
  const response = await axios.put(`${BASE_URL}/likecomment/${commentId}`);
  return response.data;
}

export const editCommentInDB = async (commentId, comment) => { 
  const response = await axios.put(`${BASE_URL}/editcomment/${commentId}`, comment);
  return response.data;
}

export const deleteCommentInDB = async (commentId) => { 
  const response = await axios.delete(`${BASE_URL}/deletecomment/${commentId}`);
  return response.data;
}