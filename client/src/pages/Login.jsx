import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      login(token, user);

      if (user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/problems");
      }
    } catch (error) {
      console.error("Login Error:", error);

      setError(
        error.response?.data?.message ||
          error.message ||
          "Unable to login. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#f6f8fc] flex items-center justify-center p-3 sm:p-5">

      {/* Main Container */}
      <div className="w-full max-w-6xl h-full max-h-[700px] bg-white rounded-3xl shadow-[0_25px_80px_rgba(15,23,42,0.10)] overflow-hidden flex">

        {/* ================================================= */}
        {/* LEFT SIDE */}
        {/* ================================================= */}

        <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden bg-[#0b1120] text-white p-10 xl:p-14 flex-col">

          {/* Background Glow */}
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />

          <div className="absolute -bottom-40 -right-20 w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-3xl" />

          {/* Grid */}
          <div
            className="absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
                <span className="text-white font-bold text-sm">
                  {"</>"}
                </span>
              </div>

              <div>
                <h2 className="text-xl font-bold tracking-tight">
                  CodeArena
                </h2>

                <p className="text-[10px] text-slate-400 uppercase tracking-[0.2em]">
                  Coding Platform
                </p>
              </div>
            </div>

            {/* Main Content */}
            <div className="my-auto max-w-lg">

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-400/20 bg-blue-500/10 text-blue-300 text-xs font-medium mb-7">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                Built for developers
              </div>

              <h1 className="text-5xl xl:text-[58px] font-bold leading-[1.08] tracking-[-2.5px]">
                Code.
                <br />
                <span className="text-blue-400">
                  Practice.
                </span>
                <br />
                <span className="text-slate-300">
                  Get better.
                </span>
              </h1>

              <p className="mt-7 text-slate-400 text-[15px] leading-7 max-w-md">
                Solve real-world coding problems, build
                your problem-solving skills and prepare
                yourself for technical interviews.
              </p>

              {/* Stats */}
              <div className="mt-10 flex items-center gap-8">

                <div>
                  <p className="text-2xl font-bold">
                    100+
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Coding Problems
                  </p>
                </div>

                <div className="w-px h-9 bg-slate-700" />

                <div>
                  <p className="text-2xl font-bold">
                    3
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Difficulty Levels
                  </p>
                </div>

                <div className="w-px h-9 bg-slate-700" />

                <div>
                  <p className="text-2xl font-bold">
                    ∞
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Practice
                  </p>
                </div>

              </div>
            </div>

            {/* Bottom */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>
                © {new Date().getFullYear()} CodeArena
              </span>

              <span>
                Keep coding, keep growing.
              </span>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* RIGHT SIDE */}
        {/* ================================================= */}

        <div className="flex-1 flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">

          <div className="w-full max-w-[390px]">

            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center gap-3 mb-12">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {"</>"}
                </span>
              </div>

              <span className="text-xl font-bold text-slate-900">
                CodeArena
              </span>
            </div>

            {/* Header */}
            <div className="mb-8">

              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-600 mb-3">
                Welcome back
              </p>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Sign in to your account
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Continue your coding journey.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3.5">

                <div className="w-5 h-5 shrink-0 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold">
                  !
                </div>

                <p className="text-xs leading-5 text-red-700">
                  {error}
                </p>

              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}
              <div>

                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-slate-700 mb-2"
                >
                  Email address
                </label>

                <div className="relative">

                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect
                        x="3"
                        y="5"
                        width="18"
                        height="14"
                        rx="2"
                      />

                      <path d="m3 7 9 6 9-6" />
                    </svg>
                  </div>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                </div>

              </div>

              {/* Password */}
              <div>

                <div className="flex items-center justify-between mb-2">

                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-700"
                  >
                    Password
                  </label>

                </div>

                <div className="relative">

                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <rect
                        x="4"
                        y="10"
                        width="16"
                        height="11"
                        rx="2"
                      />

                      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    </svg>
                  </div>

                  <input
                    id="password"
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full h-12 rounded-xl border border-slate-200 bg-slate-50/50 pl-11 pr-16 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 hover:border-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
                  >
                    {showPassword
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-blue-600 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
              >

                {loading ? (
                  <>
                    <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in

                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M5 12h14" />
                      <path d="m13 6 6 6-6 6" />
                    </svg>
                  </>
                )}

              </button>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-7">

              <div className="flex-1 h-px bg-slate-200" />

              <span className="text-[10px] font-medium text-slate-400">
                OR
              </span>

              <div className="flex-1 h-px bg-slate-200" />

            </div>

            {/* Register */}
            <div className="text-center">

              <p className="text-sm text-slate-500">
                Don't have an account?
              </p>

              <Link
                to="/register"
                className="inline-block mt-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline"
              >
                Create a new account →
              </Link>

            </div>

            {/* Security Note */}
            <div className="mt-8 flex items-center justify-center gap-2 text-[11px] text-slate-400">

              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect
                  x="4"
                  y="10"
                  width="16"
                  height="11"
                  rx="2"
                />

                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>

              Secure authentication

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;