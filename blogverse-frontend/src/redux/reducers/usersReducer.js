import { createSlice } from "@reduxjs/toolkit";
import { getUsersFromDB } from "../../services/user";
import { setNotification } from "./notificationReducer";
import { deleteUserFromDB } from "../../services/user";

const initialState = {
  users: [],
  loading: false,
  totalUsers: 0,
  lastMonthUsers: 0,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUsers(state, action) {
      return { 
        users: action.payload.users, 
        totalUsers: action.payload.totalUsers, 
        lastMonthUsers: action.payload.lastMonthUsers, 
        loading: false 
      }
    },
    initial(state, action) {
      return { ...state, loading: true }
    },
    setError(state, action) {
      return { ...state, loading: false }
    },
    addUsers(state, action) {
      return {
        ...state,
        users: [...state.users, ...action.payload.users],
        totalUsers: action.payload.totalUsers,
        lastMonthUsers: action.payload.lastMonthUsers
      }
    },
    deleteUser(state, action) { 
      return {
        loading: false,
        users: state.users.filter(user => user.id !== action.payload),
        totalUsers: state.totalUsers - 1,
        lastMonthUsers: state.lastMonthUsers - 1
      }
    }
  }
})

export const getUsers = (query = '', wantIndex = false) => {
  return async dispatch => {
    dispatch(initial())
    try {
      const response = await getUsersFromDB(query)
      if (wantIndex) {
        dispatch(addUsers(response))
      } else {
        dispatch(setUsers(response))
      }

      return response.users
    } catch (error) {
      const errorMessage = error?.response?.data?.error || 'Failed to get users'
      dispatch(setNotification(errorMessage, 'failure'))
      dispatch(setError())
    }
  }
}

export const deleteUsers = (id) => { 
  return async dispatch => {
    dispatch(initial())
    try {
      await deleteUserFromDB(id)
      dispatch(deleteUser(id))
      dispatch(setNotification('User deleted successfully', 'success'))
      return true
    } catch (error) {
      const errorMessage = error?.response?.data?.error || 'Failed to delete user'
      dispatch(setNotification(errorMessage, 'failure'))
      dispatch(setError())
      return false
    }
  }
}

export const { setUsers, initial, setError, addUsers, deleteUser } = userSlice.actions
export default userSlice.reducer