import { createSlice } from "@reduxjs/toolkit";
import { createPostInDB } from "../../services/post";
import { toast } from "react-toastify";

const initialState = {
  posts: [],
  loading: false,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts(state, action) {
      return { posts: action.payload, loading: false };
    },
    createPost(state, action) {
      return { ...state, posts: [...state.posts, action.payload] };
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
      dispatch(setPosts(newPost));
      toast.success("Post created sucessfully");
      return { success: true, slug: newPost.slug };
    } catch (error) {
      dispatch(setNotification(error.response.data.error, "failure"));
      dispatch(setError());
      return { success: false, slug: null };
    }
  };
};

export const { setPosts, createPost, initial, setError } = postsSlice.actions;
export default postsSlice.reducer;