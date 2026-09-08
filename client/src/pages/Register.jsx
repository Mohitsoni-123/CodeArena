import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await register(
        formData.name,
        formData.email,
        formData.password
      );

      navigate("/login");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-[calc(100vh-72px)] items-center justify-center overflow-hidden bg-slate-950 px-4 py-12 text-white sm:px-6">

      {/* Background */}

      <div className="pointer-events-none absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2 rounded-full bg-violet-600/10 blur-[130px]" />

      <div className="pointer-events-none absolute -left-32 bottom-0 h-72 w-72 rounded-full bg-indigo-600/10 blur-[100px]" />

      <div className="pointer-events-none absolute -right-32 top-20 h-72 w-72 rounded-full bg-purple-600/10 blur-[100px]" />

      {/* Grid */}

      <div className="pointer-events-none absolute inset-0 opacity-[0.025] [background-image:linear-gradient(rgba(255,255,255,.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:50px_50px]" />

      {/* Card */}

      <div className="relative w-full max-w-md">

        <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-r from-violet-600/20 to-indigo-600/20 opacity-70 blur-xl" />

        <div className="relative rounded-[2rem] border border-white/10 bg-slate-900/90 p-6 shadow-2xl shadow-black/50 backdrop-blur-2xl sm:p-8">

          {/* Logo */}

          <div className="flex justify-center">
            <Link
              to="/"
              className="group relative flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-600 to-indigo-600 shadow-xl shadow-violet-900/30 transition hover:-translate-y-1 hover:shadow-violet-500/20"
            >
              <span className="font-mono text-sm font-black">
                {"</>"}
              </span>
            </Link>
          </div>

          {/* Heading */}

          <div className="mt-6 text-center">
            <h1 className="text-2xl font-black tracking-tight sm:text-3xl">
              Create your account
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Start your coding journey with CodeArena.
            </p>
          </div>

          {/* Error */}

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              <span className="mt-0.5">⚠</span>
              <p>{error}</p>
            </div>
          )}

          {/* Form */}

          <form onSubmit={handleSubmit} className="mt-7 space-y-4">

            {/* Name */}

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Full Name
              </label>

              <div className="group flex items-center rounded-xl border border-white/10 bg-white/[0.03] transition focus-within:border-violet-500/40 focus-within:bg-white/[0.05] focus-within:shadow-lg focus-within:shadow-violet-900/10">
                <span className="pl-4 text-sm text-slate-600 transition group-focus-within:text-violet-400">
                  ◉
                </span>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  autoComplete="name"
                  className="w-full bg-transparent px-3 py-3.5 text-sm font-medium text-white outline-none placeholder:text-slate-700"
                />
              </div>
            </div>

            {/* Email */}

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Email Address
              </label>

              <div className="group flex items-center rounded-xl border border-white/10 bg-white/[0.03] transition focus-within:border-violet-500/40 focus-within:bg-white/[0.05] focus-within:shadow-lg focus-within:shadow-violet-900/10">
                <span className="pl-4 text-sm text-slate-600 transition group-focus-within:text-violet-400">
                  @
                </span>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  autoComplete="email"
                  className="w-full bg-transparent px-3 py-3.5 text-sm font-medium text-white outline-none placeholder:text-slate-700"
                />
              </div>
            </div>

            {/* Password */}

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>

              <div className="group flex items-center rounded-xl border border-white/10 bg-white/[0.03] transition focus-within:border-violet-500/40 focus-within:bg-white/[0.05] focus-within:shadow-lg focus-within:shadow-violet-900/10">
                <span className="pl-4 text-sm text-slate-600 transition group-focus-within:text-violet-400">
                  •
                </span>

                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="w-full bg-transparent px-3 py-3.5 text-sm font-medium text-white outline-none placeholder:text-slate-700"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="mr-2 rounded-lg px-2 py-1 text-xs font-bold text-slate-600 transition hover:bg-white/5 hover:text-slate-300"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p className="mt-2 text-[10px] text-slate-700">
                Use at least 6 characters.
              </p>
            </div>

            {/* Confirm Password */}

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Confirm Password
              </label>

              <div className="group flex items-center rounded-xl border border-white/10 bg-white/[0.03] transition focus-within:border-violet-500/40 focus-within:bg-white/[0.05] focus-within:shadow-lg focus-within:shadow-violet-900/10">
                <span className="pl-4 text-sm text-slate-600 transition group-focus-within:text-violet-400">
                  •
                </span>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className="w-full bg-transparent px-3 py-3.5 text-sm font-medium text-white outline-none placeholder:text-slate-700"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="mr-2 rounded-lg px-2 py-1 text-xs font-bold text-slate-600 transition hover:bg-white/5 hover:text-slate-300"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Terms */}

            <div className="flex items-start gap-3 pt-1">
              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border border-violet-500/30 bg-violet-500/10 text-[9px] text-violet-300">
                ✓
              </div>

              <p className="text-[11px] leading-5 text-slate-600">
                By creating an account, you agree to use CodeArena
                responsibly and follow the platform rules.
              </p>
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-2 w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 text-sm font-black text-white shadow-xl shadow-violet-900/30 transition duration-300 hover:-translate-y-0.5 hover:from-violet-500 hover:to-indigo-500 hover:shadow-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <span className="transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Divider */}

          <div className="my-7 flex items-center gap-4">
            <div className="h-px flex-1 bg-white/10" />

            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-700">
              ALREADY A MEMBER?
            </span>

            <div className="h-px flex-1 bg-white/10" />
          </div>

          {/* Login */}

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?
            </p>

            <Link
              to="/login"
              className="mt-2 inline-block text-sm font-black text-violet-400 transition hover:text-violet-300"
            >
              Login to CodeArena →
            </Link>
          </div>

          {/* Security */}

          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-700">
            <span className="text-emerald-500">●</span>
            Secure account creation
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;