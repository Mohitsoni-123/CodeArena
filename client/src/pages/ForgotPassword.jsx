import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [resetToken, setResetToken] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [resendLoading, setResendLoading] = useState(false);

  const [cooldown, setCooldown] = useState(0);

  const startCooldown = () => {
    setCooldown(60);

    const timer = setInterval(() => {
      setCooldown((previous) => {
        if (previous <= 1) {
          clearInterval(timer);
          return 0;
        }

        return previous - 1;
      });
    }, 1000);
  };

  // STEP 1: Send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setMessage(
        response.data?.message ||
          "OTP has been sent to your email address."
      );

      setStep(2);
      startCooldown();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to send OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (!/^\d{6}$/.test(otp.trim())) {
      setError("OTP must be 6 digits.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/verify-reset-otp", {
        email: email.trim(),
        otp: otp.trim(),
      });

      setResetToken(response.data.resetToken);

      setMessage(
        response.data?.message ||
          "OTP verified successfully."
      );

      setStep(3);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Invalid or expired OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  // STEP 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/reset-password", {
        email: email.trim(),
        resetToken,
        newPassword,
      });

      setMessage(
        response.data?.message ||
          "Password reset successfully."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0 || resendLoading) {
      return;
    }

    setError("");
    setMessage("");

    try {
      setResendLoading(true);

      const response = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setMessage(
        response.data?.message ||
          "A new OTP has been sent to your email."
      );

      setOtp("");
      startCooldown();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to resend OTP."
      );
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Forgot Password
          </h1>

          <p className="text-gray-500 mt-2">
            {step === 1 &&
              "Enter your email to receive an OTP."}

            {step === 2 &&
              "Enter the 6-digit OTP sent to your email."}

            {step === 3 &&
              "Create a new password for your account."}
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${
              step >= 1
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            1
          </div>

          <div
            className={`w-12 h-1 ${
              step >= 2 ? "bg-black" : "bg-gray-200"
            }`}
          />

          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${
              step >= 2
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            2
          </div>

          <div
            className={`w-12 h-1 ${
              step >= 3 ? "bg-black" : "bg-gray-200"
            }`}
          />

          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold ${
              step >= 3
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-500"
            }`}
          >
            3
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Success */}
        {message && (
          <div className="mb-5 rounded-lg bg-green-50 border border-green-200 text-green-600 px-4 py-3 text-sm">
            {message}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleSendOtp}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-black"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-5 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter OTP
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, ""))
              }
              placeholder="Enter 6-digit OTP"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 text-center text-xl tracking-[0.5em] outline-none focus:border-black"
              disabled={loading}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-5 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="text-center mt-5">
              {cooldown > 0 ? (
                <p className="text-sm text-gray-500">
                  Resend OTP in {cooldown}s
                </p>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendLoading}
                  className="text-sm font-semibold text-black hover:underline disabled:opacity-50"
                >
                  {resendLoading
                    ? "Sending..."
                    : "Resend OTP"}
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setStep(1);
                setError("");
                setMessage("");
              }}
              className="w-full mt-3 text-sm text-gray-500 hover:text-black"
            >
              Change Email
            </button>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            {/* New Password */}
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-16 outline-none focus:border-black"
                disabled={loading}
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((previous) => !previous)
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 hover:text-black"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            {/* Confirm Password */}
            <label className="block text-sm font-medium text-gray-700 mb-2 mt-5">
              Confirm Password
            </label>

            <div className="relative">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-16 outline-none focus:border-black"
                disabled={loading}
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(
                    (previous) => !previous
                  )
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-600 hover:text-black"
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50"
            >
              {loading
                ? "Resetting Password..."
                : "Reset Password"}
            </button>
          </form>
        )}

        {/* Login Link */}
        <div className="text-center mt-7">
          <Link
            to="/login"
            className="text-sm font-semibold text-gray-700 hover:text-black hover:underline"
          >
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;