import { createSlice } from '@reduxjs/toolkit'
import { setNotification } from './notificationReducer'
import { signin, google } from '../../services/auth'

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


export const { setUser, signInInitial, signInError } = authSlice.actions
export default authSlice.reducer