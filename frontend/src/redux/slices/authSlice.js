import { createSlice } from "@reduxjs/toolkit";

// Load persisted user from localStorage
const storedUser = JSON.parse(localStorage.getItem("taskify_user"));

const initialState = {
  // Determine auth state based on stored user
  isAuthenticated: !!storedUser,
  user: storedUser
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Set authenticated user after login
    setAuthUser: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;

      // Persist user session in localStorage
      localStorage.setItem(
        "taskify_user",
        JSON.stringify(action.payload)
      );
    },

    // Clear user session on logout
    logoutUser: (state) => {
      state.isAuthenticated = false;
      state.user = null;

      // Remove persisted user data
      localStorage.removeItem("taskify_user");
    }
  }
});

export const { setAuthUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
