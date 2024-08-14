import { createSlice } from '@reduxjs/toolkit'
import { setNotification } from './notificationReducer'
import { signin, google } from '../../services/auth'
import { update } from '../../services/user'

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
    signInInitial(state, action) {
      return { ...state, loading: true }
    },
    signInError(state, action) {
      return { ...state,  loading: false }
    },
    updateInitial(state, action) { 
      return { ...state, loading: true }
    },
    updateUser(state, action) { 
      return { user: action.payload, loading: false }
    },
    updateError(state, action) { 
      return { ...state, loading: false }
    }

  }
})

export const login = (credentials) => { 
  return async dispatch => {
    dispatch(signInInitial())
    try {
      const user = await signin(credentials)
      dispatch(setUser(user))
      // dispatch(setNotification('Logged in', 'success'))
      return true
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'failure'))
      dispatch(signInError())
      return false
    }
  }
}

export const googleLogin = (credentials) => { 
  return async dispatch => {
    dispatch(signInInitial())
    try {
      const user = await google(credentials)
      dispatch(setUser(user))
      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }
}

export const updateUserDetails = (credentials) => { 
  return async dispatch => {
    dispatch(updateInitial())
    try {
      const user = await update(credentials)
      dispatch(updateUser(user))
      dispatch(setNotification('User"s profile updated sucessfully', 'success'))
    } catch (error) {
      dispatch(setNotification(error.response.data.error, 'failure'))
      dispatch(updateError())
    }
  }
}


export const { setUser, signInInitial, signInError, updateInitial, updateUser, updateError } = authSlice.actions
export default authSlice.reducer