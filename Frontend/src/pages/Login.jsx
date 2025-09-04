import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import GoogleSignIn from "../components/GoogleSignIn";
import { setToken, setUser } from "../utils/auth";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const resp = await API.post("/auth/login", form);
      setToken(resp.data.token);
      setUser(resp.data.user);
      nav("/welcome");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Form */}
      <div className="flex items-center justify-center p-6">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 lg:left-4 lg:translate-x-0">
          <img
            src="https://res.cloudinary.com/djlo5utij/image/upload/v1756900854/top_gafwmg.png"
            alt="HD Logo"
            className="w-16 h-8"
          />
        </div>
        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-sm">
          {/* Logo + Branding */}
          <h2 className="text-2xl font-semibold mb-4">Login</h2>
          {error && <div className="text-sm text-red-600 mb-2">{error}</div>}
          <form onSubmit={submit} className="space-y-3">
            <input
              name="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="Email"
              className="w-full p-2 border rounded"
            />
            <input
              name="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="Password"
              type="password"
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              {loading ? "Logging..." : "Login"}
            </button>
          </form>

          <div className="my-3 text-center text-gray-500">Or</div>
          <GoogleSignIn />

          <p className="mt-4 text-sm text-gray-600 text-center">
            Don’t have an account?{" "}
            <a href="/" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>

      {/* Right Image */}
      <div className="hidden lg:flex items-center justify-center">
        <img
          src="https://res.cloudinary.com/djlo5utij/image/upload/v1756899484/right-column_tx6pl8.jpg"
          alt="Login illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
