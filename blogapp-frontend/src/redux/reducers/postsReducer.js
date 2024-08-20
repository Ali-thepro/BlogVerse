import { createSlice } from "@reduxjs/toolkit";
import { createPostInDB, getPostsFromDB, deletePostFromDB, editPostInDB } from "../../services/post";
import { setNotification } from "./notificationReducer";
import { toast } from "react-toastify";

const initialState = {
  posts: [],
  totalPosts: 0,
  lastMonthPosts: 0,
  loading: false,
};
const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts(state, action) {
      return { 
        posts: action.payload.posts, 
        totalPosts: action.payload.totalPosts, 
        lastMonthPosts: action.payload.lastMonthPosts, 
        loading: false 
      };
    },
    createPost(state, action) {
      return {
        loading: false,
        posts: [...state.posts, action.payload],
        totalPosts: state.totalPosts + 1,
        lastMonthPosts: state.lastMonthPosts + 1,
      };
    },
    addPosts(state, action) { 
      return { 
        posts: [...state.posts, ...action.payload.posts],
        totalPosts: action.payload.totalPosts,
        lastMonthPosts: action.payload.lastMonthPosts,
        loading: false
      };
    },
    removePost(state, action) {
      return { ...state, loading: false, posts: state.posts.filter((post) => post.id !== action.payload) };
    },
    updatePost(state, action) { 
      return { ...state, loading: false, posts: state.posts.map((post) => post.id === action.payload.id ? action.payload : post) };
    },
    initial(state, action) {
      return { ...state, loading: true };
    },
    setError(state, action) {
      return { ...state, loading: false };
    },
  },
});


export const createNewPost = (post) => {
  return async (dispatch) => {
    dispatch(initial());
    try {
      const newPost = await createPostInDB(post);
      dispatch(createPost(newPost));
      toast.success("Post created sucessfully");
      return { success: true, slug: newPost.slug };
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred";
      dispatch(setNotification(errorMessage, "failure"));
      dispatch(setError() );
      return { success: false, slug: null };
    }
  };
};

export const getPosts = (query = '', wantIndex = false) => {
  return async (dispatch) => {
    dispatch(initial());
    try {
      const response = await getPostsFromDB(query);
      const payload = {
        posts: response.posts,
        totalPosts: response.totalPosts,
        lastMonthPosts: response.lastMonthPosts
      };
      if (wantIndex) {
        dispatch(addPosts(payload));
      } else {
        dispatch(setPosts(payload));
      }
      return response.posts;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred";
      dispatch(setNotification(errorMessage, "failure"));
      dispatch(setError());
    }
  };
};

export const deletePost = (postId) => { 
  return async (dispatch) => {
    dispatch(initial());
    try {
      await deletePostFromDB(postId);
      dispatch(removePost(postId));
      dispatch(setNotification("Post deleted successfully", "success"));
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred";
      dispatch(setNotification(errorMessage, "failure"));
      dispatch(setError());
    }
  };
}

export const editPost = (postId, post) => {
  return async (dispatch) => {
    dispatch(initial());
    try {
      const updatedPost = await editPostInDB(postId, post);
      dispatch(updatePost(updatedPost));
      toast.success("Post updated successfully");
      return { success: true, slug: updatedPost.slug };
    } catch (error) {
      console.log(error);
      const errorMessage = error.response?.data?.error || "An error occurred";
      dispatch(setNotification(errorMessage, "failure"));
      dispatch(setError());
      return { success: false, slug: null };
    }
  };
}

export const { setPosts, createPost, initial, setError, addPosts, removePost, updatePost} = postsSlice.actions;
export default postsSlice.reducer;