import { createSlice } from "@reduxjs/toolkit";

let timeoutId

const notificationSlice = createSlice({
  name: 'notification',
  initialState: {
    message: null,
    status: null
  },
  reducers: {
    set(state, action) {
      return action.payload
    },
    hide(state, action) {
      return null
    }
  }
})

export const setNotification = (message, status) => {
  return async (dispatch) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    dispatch(set({ message, status }))
    timeoutId = setTimeout(() => {
      dispatch(hide())
    }, 5000)
  }
}

export const { set, hide } = notificationSlice.actions
export default notificationSlice.reducer