import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);
    setError("");

    const response = await api.post("/auth/login", {
      email,
      password,
    });

    // Save token
    login(response.data.token, response.data.user);

    // Redirect based on role
    if (response.data.user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/problems");
    }

  } catch (error) {
    console.error("Login Error:", error);

    setError(
      error.response?.data?.message || "Login failed"
    );
  } finally {
    setLoading(false);
  }
};
  return (
    <div style={{ padding: "30px", maxWidth: "400px" }}>
      <h1>Login</h1>

      {error && <p style={{ color: "red" }}> {error} </p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "5px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Password</label>

          <div style={{ display: "flex", marginTop: "5px" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px",
                boxSizing: "border-box",
              }}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                marginLeft: "5px",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Loggin in..." : "Login"}
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
