import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import GoogleSignIn from "../components/GoogleSignIn";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  const validate = () => {
    if (!form.name.trim()) return "Name required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Valid email required";
    if (!form.password || form.password.length < 6)
      return "Password min 6 chars";
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    try {
      setLoading(true);
      await API.post("/auth/signup", form);
      nav(`/verify-otp?email=${encodeURIComponent(form.email)}`);
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Form */}
      <div className="flex items-center justify-center p-6 relative">
        {/* Logo */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 lg:left-4 lg:translate-x-0">
          <img
            src="https://res.cloudinary.com/djlo5utij/image/upload/v1756900854/top_gafwmg.png"
            alt="HD Logo"
            className="w-16 h-8"
          />
        </div>

        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm mt-16 lg:mt-0">
          <h2 className="text-2xl font-semibold mb-4">Create account</h2>
          {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
          <form onSubmit={submit} className="space-y-3">
            <input
              name="name"
              value={form.name}
              onChange={onChange}
              placeholder="Full name"
              className="w-full p-2 border rounded"
            />
            <input
              name="email"
              value={form.email}
              onChange={onChange}
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
            <input
              name="password"
              value={form.password}
              onChange={onChange}
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Please wait..." : "Sign up"}
            </button>
          </form>

          <div className="my-3 text-center text-gray-500">Or</div>
          <GoogleSignIn />

          <p className="mt-4 text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>

      {/* Right Image (hidden on mobile) */}
      <div className="hidden lg:flex items-center justify-center">
        <img
          src="https://res.cloudinary.com/djlo5utij/image/upload/v1756899484/right-column_tx6pl8.jpg"
          alt="Signup illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
