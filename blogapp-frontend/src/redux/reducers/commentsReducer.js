import { createSlice } from '@reduxjs/toolkit';
import { createCommentInDB,  getCommentsInDB, getPostCommentsInDB, likeCommentInDB, editCommentInDB, deleteCommentInDB } from '../../services/comment';
import { setNotification } from './notificationReducer';

const initialState = {
  comments: [],
  totalComments: 0,
  lastMonthComments: 0,
  loading: false,
};

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    setAllComments(state, action) {
      return {
        comments: action.payload.comments,
        totalComments: action.payload.totalComments,
        lastMonthComments: action.payload.lastMonthComments,
        loading: false,
      };
    },
    addAllComments(state, action) {
      return {
        comments: [...state.comments, ...action.payload.comments],
        totalComments: action.payload.totalComments,
        lastMonthComments: action.payload.lastMonthComments,
        loading: false,
      };
    },
    addComment(state, action) {
      return {
        comments: [...state.comments, action.payload],
        totalComments: state.totalComments + 1,
        lastMonthComments: state.lastMonthComments + 1,
        loading: false,
      };
    },
    setComments(state, action) { 
      return {
        ...state,
        comments: action.payload.comments,
        loading: false,
        totalComments: action.payload.totalComments
      };
    },
    addComments(state, action) { 
      return {
        ...state,
        loading: false,
        comments: [...state.comments, ...action.payload],
      };
    },
    removeComment(state, action) {
      return {
        ...state,
        loading: false,
        comments: state.comments.filter((comment) => comment.id !== action.payload),
      };
    },
    updateComment(state, action) {
      return {
        ...state,
        loading: false,
        comments: state.comments.map((comment) =>
          comment.id === action.payload.id ? action.payload : comment
        ),
      };
    },
    initial(state, action) {
      return { ...state, loading: true };
    },
    setError(state, action) {
      return { ...state, loading: false };
    },
  },
});

export const createComment = (comment) => { 
  return async (dispatch) => {
    dispatch(initial());
    try {
      const newComment = await createCommentInDB(comment);
      dispatch(addComment(newComment));
      dispatch(setNotification('Comment created successfully', 'success'));
    } catch (error) {
      console.log(error)
      const errorMessage = error?.response?.data?.error || 'An error occurred';
      dispatch(setNotification(errorMessage, 'failure'));
    }
  };
}


export const getComments = (query = '', wantIndex = false) => { 
  return async (dispatch) => {
    dispatch(initial());
    try {
      const response = await getCommentsInDB(query);
      if (wantIndex) {
        dispatch(addAllComments(response));
      } else {
        dispatch(setAllComments(response));
      }
      return response.comments
    } catch (error) {
      console.log(error)
      const errorMessage = error?.response?.data?.error || 'An error occurred';
      dispatch(setError(errorMessage));
    }
  };
}

export const getPostComments = (postId, query = '', wantIndex = false) => {
  return async (dispatch) => {
    dispatch(initial());
    try {
      const response = await getPostCommentsInDB(postId, query);
      if (wantIndex) {
        dispatch(addComments(response.comments));
        return response.comments
      } else {
        dispatch(setComments(response));
      }
      return response.comments
    } catch (error) {
      console.log(error)
      const errorMessage = error?.response?.data?.error || 'An error occurred';
      dispatch(setError(errorMessage));
    }
  };
}

export const likeComment = (commentId) => { 
  return async (dispatch) => {
    dispatch(initial());
    try {
      const likedComment = await likeCommentInDB(commentId);
      dispatch(updateComment(likedComment));
    } catch (error) {
      console.log(error)
      const errorMessage = error?.response?.data?.error || 'An error occurred';
      dispatch(setNotification(errorMessage, 'failure'));
    }
  };
}


export const editComment = (commentId, comment) => { 
  return async (dispatch) => {
    dispatch(initial());
    try {
      const editedComment = await editCommentInDB(commentId, comment);
      dispatch(updateComment(editedComment));
      dispatch(setNotification('Comment edited successfully', 'success'));
    } catch (error) {
      console.log(error)
      const errorMessage = error?.response?.data?.error || 'An error occurred';
      dispatch(setNotification(errorMessage, 'failure'));
    }
  };
}

export const deleteComment = (commentId) => { 
  return async (dispatch) => {
    dispatch(initial());
    try {
      await deleteCommentInDB(commentId);
      dispatch(removeComment(commentId));
      dispatch(setNotification('Comment deleted successfully', 'success'));
    } catch (error) {
      console.log(error)
      const errorMessage = error?.response?.data?.error || 'An error occurred';
      dispatch(setNotification(errorMessage, 'failure'));
    }
  };
}


export const { setAllComments, addComment, addAllComments, setComments, addComments, removeComment, updateComment, initial, setError } = commentSlice.actions;
export default commentSlice.reducer;
