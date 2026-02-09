import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login } from "../../services/operations/authOperations";

// Login form for user authentication
export default function LoginForm({ onSuccess }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local form state
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: ""
  });

  // Handle input changes
  const handleChange = (e) =>
    setForm({ ...form, [e?.target?.name]: e?.target?.value });

  // Handle login submission
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      login(form?.email, form?.password, form?.role, navigate)
    ).then((res) => {
      if (res) onSuccess();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="email"
        type="email"
        placeholder="Email"
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
      />

      <input
        name="password"
        type="password"
        placeholder="Password"
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
      />

      <select
        name="role"
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
      >
        <option value="">Select Role</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
      >
        Login
      </button>
    </form>
  );
}
