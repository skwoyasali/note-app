import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { setToken, setUser } from "../utils/auth";
import API from "../api/api";

export default function OAuthSuccess() {
  const [params] = useSearchParams();
  const nav = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      nav("/login");
      return;
    }

    (async () => {
      try {
        // Save token in localStorage
        setToken(token);

        // Fetch user from backend (MongoDB)
        const resp = await API.get("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Save user in localStorage
        setUser(resp.data.user);

        nav("/welcome");
      } catch (err) {
        console.error("OAuth fetch error:", err);
        nav("/login");
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      Processing OAuth...
    </div>
  );
}
