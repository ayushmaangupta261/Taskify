import { Routes, Route } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import AdminDashboard from "../pages/admin/AdminDashboard";
import RestrictedRoute from "../components/authComponent/RestrictedRoute";
import UserDashboard from "../pages/user/UserDashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<Home />} />

        <Route
          path="admin-dashboard"
          element={
            <RestrictedRoute>
              <AdminDashboard />
            </RestrictedRoute>
          }
        />
        <Route
          path="user-dashboard"
          element={
            <RestrictedRoute>
              <UserDashboard />
            </RestrictedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
