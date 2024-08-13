import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import notificationReducer from './reducers/notificationReducer';
import authReducer from './reducers/authReducer';
import themeReducer from './reducers/themeReducer';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  notification: notificationReducer,
  auth: authReducer,
  theme: themeReducer
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
  blacklist: ['notification']
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
});

export const persistor = persistStore(store);