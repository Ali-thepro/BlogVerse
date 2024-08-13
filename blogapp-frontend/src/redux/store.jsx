import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './reducers/notificationReducer';
// import authReducer from './reducers/authReducer';

const store = configureStore({
  reducer: {
    notification: notificationReducer
  }
})

export default store;