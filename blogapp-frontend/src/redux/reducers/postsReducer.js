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
      return { ...state, posts: [...state.posts, action.payload] };
    },
    addPosts(state, action) { 
      return { 
        ...state, 
        posts: [...state.posts, ...action.payload.posts],
        totalPosts: action.payload.totalPosts,
        lastMonthPosts: action.payload.lastMonthPosts
      };
    },
    deleteAPost(state, action) {
      return { ...state, posts: state.posts.filter((post) => post.id !== action.payload) };
    },
    updatePost(state, action) { 
      return { ...state, posts: state.posts.map((post) => post.id === action.payload.id ? action.payload : post) };
    },
    initial(state, action) {
      return { ...state, loading: true };
    },
    setError(state, action) {
      return { ...state, loading: false };
    },
    loadingOff(state, action) {
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
      dispatch(loadingOff());
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
      dispatch(loadingOff());
      return response.posts;
    } catch (error) {
      const errorMessage = error.response?.data?.error || "An error occurred";
      dispatch(setNotification(errorMessage, "failure"));
      dispatch(setError());
      return false;
    }
  };
};

export const deletePost = (postId) => { 
  return async (dispatch) => {
    dispatch(initial());
    try {
      await deletePostFromDB(postId);
      dispatch(deleteAPost(postId));
      dispatch(loadingOff());
      toast.success("Post deleted successfully");
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
      dispatch(loadingOff());
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

export const { setPosts, createPost, initial, setError, loadingOff, addPosts, deleteAPost, updatePost} = postsSlice.actions;
export default postsSlice.reducer;