import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

// Configure and create Redux store
export const store = configureStore({
  reducer: {
    // Authentication state slice
    auth: authReducer
  }
});
