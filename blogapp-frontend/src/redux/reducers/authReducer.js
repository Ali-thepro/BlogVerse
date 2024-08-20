import { createSlice } from '@reduxjs/toolkit'
import { setNotification } from './notificationReducer'
import { signin, google } from '../../services/auth'
import { update, deleteUserFromDB, signOutUserFromDB } from '../../services/user'
import { toast } from 'react-toastify'


const initialState = {
  user: null,
  loading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action) {
      return { user: action.payload, loading: false }
    },
    initial(state, action) {
      return { ...state, loading: true }
    },
    setError(state, action) {
      return { ...state,  loading: false }
    },
    editUser(state, action) { 
      return { user: action.payload, loading: false }
    },
    removeUser(state, action) { 
      return { user: null, loading: false }
    },
    removeUserThroughAdmin(state, action) { 
      return { ...state, loading: false}
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
      toast.success('Logged in')
      return true
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'failure'))
      dispatch(setError())
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
      toast.success('Logged in')
      return true
    } catch (error) {
      toast.error(error.response.data.error)
      dispatch(setNotification(error.response.data.error, 'failure'))
      dispatch(error())
      return false
    }
  }
}

export const updateUser = (userId, credentials) => { 
  return async dispatch => {
    dispatch(initial())
    try {
      const user = await update(userId, credentials)
      dispatch(editUser(user))
      dispatch(setNotification('User"s profile updated sucessfully', 'success'))
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'failure'))
      dispatch(setError())
    }
  }
}

export const deleteUser = (id, isAdmin = false) => { 
  return async dispatch => {
    dispatch(initial())
    try {
      await deleteUserFromDB(id)
      if (isAdmin) {
        dispatch(removeUserThroughAdmin())
        dispatch(setNotification('User deleted successfully', 'success'))
      } else {
        dispatch(removeUser())
        toast.success('User deleted successfully')
      }
      return true
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'failure'))
      dispatch(setError())
      return false
    }
  }
}

export const signOutUser = () => { 
  return async dispatch => {
    dispatch(initial())
    try {
      await signOutUserFromDB()
      dispatch(signOut())
      toast.success('User signed out sucessfully')
      return true
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'failure'))
      dispatch(setError())
      return false
    }
  }
}




export const { setUser, initial, setError, editUser, removeUser, signOut, removeUserThroughAdmin } = authSlice.actions
export default authSlice.reducer