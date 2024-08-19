import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import notificationReducer from './reducers/notificationReducer';
import authReducer from './reducers/authReducer';
import themeReducer from './reducers/themeReducer';
import categoryReducer from './reducers/categoryReducer';
import postsReducer from './reducers/postsReducer';
import usersReducer from './reducers/usersReducer';
import storage from 'redux-persist/lib/storage';
import expireReducer from 'redux-persist-expire';

const rootReducer = combineReducers({
  notification: notificationReducer,
  auth: authReducer,
  theme: themeReducer,
  category: categoryReducer,
  posts: postsReducer,
  users: usersReducer,
});


const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  blacklist: ['notification', 'category', 'posts', 'user'],
  transforms: [
    expireReducer('auth', {
      expireSeconds: 7200,
      expiredState: {},
      autoExpire: true,
    }),
  ],
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
});

export const persistor = persistStore(store);