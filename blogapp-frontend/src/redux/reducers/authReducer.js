import { createSlice } from '@reduxjs/toolkit'
import { setNotification } from './notificationReducer'
import { signin, google } from '../../services/auth'
import { update, deleteUserFromDB, signOutUserFromDB } from '../../services/user'

const state = () => {
  return ({
    user: null,
    loading: false,
  })
}

const authSlice = createSlice({
  name: 'auth',
  initialState: state(),
  reducers: {
    setUser(state, action) {
      return { user: action.payload, loading: false }
    },
    initial(state, action) {
      return { ...state, loading: true }
    },
    error(state, action) {
      return { ...state,  loading: false }
    },
    updateUser(state, action) { 
      return { user: action.payload, loading: false }
    },
    deleteUser(state, action) { 
      return { user: null, loading: false }
    },
    signOut(state, action) { 
      return { user: null, loading: false }
    }

  }
})

export const login = (credentials) => { 
  return async dispatch => {
    dispatch(initial())
    try {
      const user = await signin(credentials)
      dispatch(setUser(user))
      // dispatch(setNotification('Logged in', 'success'))
      return true
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'failure'))
      dispatch(error())
      return false
    }
  }
}

export const googleLogin = (credentials) => { 
  return async dispatch => {
    dispatch(initial())
    try {
      const user = await google(credentials)
      dispatch(setUser(user))
      return true
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'failure'))
      dispatch(error())
      return false
    }
  }
}

export const updateUserDetails = (credentials) => { 
  return async dispatch => {
    dispatch(initial())
    try {
      const user = await update(credentials)
      dispatch(updateUser(user))
      dispatch(setNotification('User"s profile updated sucessfully', 'success'))
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'failure'))
      dispatch(error())
    }
  }
}

export const deleteUserDetails = (id) => { 
  return async dispatch => {
    dispatch(initial())
    try {
      await deleteUserFromDB(id)
      dispatch(deleteUser())
      dispatch(setNotification('User deleted sucessfully', 'success'))
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'failure'))
      dispatch(error())
    }
  }
}

export const signOutUser = () => { 
  return async dispatch => {
    dispatch(initial())
    try {
      await signOutUserFromDB()
      dispatch(signOut())
      dispatch(setNotification('User signed out sucessfully', 'success'))
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'failure'))
      dispatch(error())
    }
  }
}




export const { setUser, initial, error, updateUser, deleteUser, signOut } = authSlice.actions
export default authSlice.reducer