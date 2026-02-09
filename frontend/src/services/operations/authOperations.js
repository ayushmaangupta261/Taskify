
import { apiConnector } from "../apiConnector";
import { authEnpoint } from "../endpoints/authEndpoints.js";
import { toast } from "sonner";
import { setAuthUser } from "../../redux/slices/authSlice";

// Extract auth API endpoints
const { login_api, register_api } = authEnpoint;

// Handle user login
export const login = (email, password, role, navigate) => async (dispatch) => {
  // Show loading toast
  const toastId = toast.loading("Signing in...");

  try {
    // Call login API
    const response = await apiConnector(
      "POST",
      login_api,
      { email, password, role }
    );

    // Validate API response
    if (!response?.data?.success) {
      throw new Error("Login failed");
    }

    // Store authenticated user in Redux
    dispatch(setAuthUser(response.data.user));

    // Show success feedback
    toast.success("Login successful", { id: toastId });

    // Redirect based on role
    if (role === "admin") {
      navigate("/admin-dashboard");
      return true;
    } else {
      navigate("/user-dashboard");
      return true;
    }
  } catch (error) {
    // Resolve and show error message
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.errors?.[0]?.message ||
      "Invalid email, password, or role";

    toast.error(msg, { id: toastId });
    return null;
  }
};



//-------------------------------------------------------------------------------------------



// Handle user registration
export const register = (name, email, password, role, navigate) => async () => {
  // Show loading toast
  const toastId = toast.loading("Creating your account...");

  try {
    // Call register API
    const response = await apiConnector(
      "POST",
      register_api,
      { name, email, password, role }
    );

    // Validate API response
    if (!response?.data?.success) {
      toast.error("Signup failed", { id: toastId });
      return null;
    }

    // Show success feedback
    toast.success(
      "Account created successfully! Please login.",
      { id: toastId }
    );

    return true;
  } catch (error) {
    // Resolve and show error message
    const msg =
      error?.response?.data?.message ||
      error?.response?.data?.errors?.[0]?.message ||
      "Server error during signup";

    toast.error(msg, { id: toastId });
    return null;
  }
};


