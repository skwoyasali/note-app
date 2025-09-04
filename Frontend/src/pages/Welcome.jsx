import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { getUser } from "../utils/auth";

export default function Welcome() {
  const user = getUser();
  const nav = useNavigate();

  // Redirect to login if no user found
  React.useEffect(() => {
    if (!user) nav("/login");
  }, [user, nav]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
          {/* Logo or Icon */}
          <div className="flex justify-center mb-6">
            <img
              src="https://res.cloudinary.com/djlo5utij/image/upload/v1756900854/top_gafwmg.png"
              alt="HD Logo"
              className="w-20 h-10"
            />
          </div>

          {/* Welcome Message */}
          <h2 className="text-3xl font-bold text-gray-900 text-center">
            Welcome, {user?.name || "User"} 🎉
          </h2>
          <p className="text-sm text-gray-600 text-center mt-2">
            Email: {user?.email || "—"}
          </p>

          {/* Action Button */}
          <div className="mt-6 flex justify-center">
            <Link
              to="/notes"
              className="px-6 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 transition"
            >
              Go to Notes
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
