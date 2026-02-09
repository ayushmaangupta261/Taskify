import { useState } from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

// Modal wrapper for login and registration flows
export default function AuthModal({ onClose }) {
  // Toggle between login and register views
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative w-full max-w-md rounded-lg bg-white p-6">

        {/* Close modal */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-black"
          aria-label="Close"
        >
          ✕
        </button>

        {/* Modal heading */}
        <h2 className="mb-4 text-center text-xl font-semibold">
          {isLogin ? "Login to Taskify" : "Create Taskify Account"}
        </h2>

        {/* Render login or register form */}
        {isLogin ? (
          <LoginForm onSuccess={onClose} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setIsLogin(true)} />
        )}

        {/* Switch between login and register */}
        <p className="mt-4 text-center text-sm">
          {isLogin ? "Don’t have an account?" : "Already have an account?"}
          <span
            onClick={() => setIsLogin(!isLogin)}
            className="ml-1 cursor-pointer text-indigo-600 hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

