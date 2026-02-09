import axios from "axios";
import { store } from "../redux/store";
import { logoutUser } from "../redux/slices/authSlice";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  withCredentials: true
});



export const apiConnector = (
  method,
  url,
  bodyData = null,
  headers = {},
  params = {}
) => {
  return axiosInstance({
    method,
    url,
    data: bodyData,
    headers,
    params
  });
};



// Auto logout on auth failure (expired / invalid cookie)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      // Clear auth state
      store.dispatch(logoutUser());

      // Redirect to home/login
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);