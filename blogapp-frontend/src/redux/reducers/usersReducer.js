import { createSlice } from "@reduxjs/toolkit";
import { getUsersFromDB } from "../../services/user";
import { setNotification } from "./notificationReducer";

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

export const { setUsers, initial, setError, addUsers } = userSlice.actions
export default userSlice.reducer