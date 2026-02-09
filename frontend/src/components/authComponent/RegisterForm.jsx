import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/operations/authOperations";

// Registration form for creating a new user account
export default function RegisterForm({ onSwitchToLogin }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Local form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });

  // Handle input changes
  const handleChange = (e) =>
    setForm({ ...form, [e?.target?.name]: e?.target?.value });

  // Handle registration submission
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      register(form?.name, form?.email, form?.password, form?.role, navigate)
    ).then((res) => {
      if (res) onSwitchToLogin();
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        name="name"
        placeholder="Name"
        onChange={handleChange}
        className="w-full border px-3 py-2 rounded focus:ring-2 focus:ring-indigo-500"
      />

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
        placeholder="Password mube be 8 digit long"
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
        Register
      </button>
    </form>
  );
}
