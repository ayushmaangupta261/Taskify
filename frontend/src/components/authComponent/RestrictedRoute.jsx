import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

// Route guard to restrict access for unauthenticated users
export default function RestrictedRoute({ children }) {
  // Read authentication state from Redux store
  const { isAuthenticated } = useSelector((state) => state?.auth);
  const location = useLocation();

  // Redirect to login/home if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  // Render protected content if authenticated
  return children;
}
