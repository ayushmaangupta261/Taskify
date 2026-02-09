import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import AuthModal from "./authComponent/AuthModal";
import { logoutUser } from "../redux/slices/authSlice";

// Top navigation bar with auth-aware actions
export default function Navbar() {
  // Controls auth modal visibility
  const [open, setOpen] = useState(false);

  // Read auth state from Redux
  const { isAuthenticated, user } = useSelector((state) => state?.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle user logout
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  return (
    <>
      <nav className="flex items-center justify-between px-8 py-4 border-b bg-white">
        {/* App logo / home navigation */}
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-indigo-600 cursor-pointer"
        >
          Taskify
        </h1>

        {/* Auth actions */}
        {!isAuthenticated ? (
          <button
            onClick={() => setOpen(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Login / Register
          </button>
        ) : (
          <div className="flex items-center gap-4">
            {/* Logged-in user name */}
            <span className="text-sm text-gray-600">
              {user?.name}
            </span>

            {/* Role-based dashboard navigation */}
            <button
              onClick={() =>
                navigate(
                  user?.role === "admin"
                    ? "/admin-dashboard"
                    : "/user-dashboard"
                )
              }
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            >
              Dashboard
            </button>

            {/* Logout action */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </nav>

      {/* Authentication modal */}
      {open && <AuthModal onClose={() => setOpen(false)} />}
    </>
  );
}
