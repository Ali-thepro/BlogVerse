// import { createSlice } from '@reduxjs/toolkit'
// import { setNotification } from './notificationReducer'

// const state = () => {
//   const user = storage.loadUser()
//   if (user) {
//     return { user, isLoggedIn: true }
//   }
//   return { user: null, isLoggedIn: false } 
// }

// const authSlice = createSlice({
//   name: 'auth',
//   initialState: state(),
//   reducers: {
//     setUser(state, action) {
//       return { user: action.payload, isLoggedIn: true }
//     },
//     clearUser(state) {
//       return { user: null, isLoggedIn: false }
//     }
//   }
// })

// export const login = (credentials) => { 
//   return async dispatch => {
//     try {
//       const user = await loginService.login(credentials)
//       storage.saveUser(user)
//       dispatch(setUser(user))
//       dispatch(setNotification('Logged in', 5, 'success'))
//     } catch (error) {
//       dispatch(setNotification(error.response.data.error, 5, 'error'))
//     }
//   }
// }

// export const logout = () => { 
//   return async dispatch => {
//     storage.removeItem()
//     dispatch(clearUser())
//     dispatch(setNotification('Logged out', 5, 'success'))
//   }
// }

// export const { setUser, clearUser } = authSlice.actions
// export default authSlice.reducer