import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// ===============================
// REGISTER
// ===============================
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please provide name, email and password",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "Registration successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ===============================
// LOGIN
// ===============================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ===============================
// GET CURRENT USER
// ===============================
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user,
    });
  } catch (error) {
    console.error("Get Me Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ===============================
// SEND EMAIL USING RESEND
// ===============================
const sendEmail = async ({ to, subject, html }) => {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",

    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      from: "CodeArena <onboarding@resend.dev>",
      to: [to],
      subject,
      html,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("Resend Error:", data);

    throw new Error(
      data?.message || "Failed to send email"
    );
  }

  return data;
};

// ===============================
// FORGOT PASSWORD - SEND OTP
// ===============================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    // Don't reveal whether an email exists
    if (!user) {
      return res.json({
        message:
          "If an account exists with this email, an OTP has been sent.",
      });
    }

    // Generate 6 digit OTP
    const otp = crypto
      .randomInt(100000, 1000000)
      .toString();

    // Hash OTP before saving
    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp)
      .digest("hex");

    user.resetOtp = hashedOtp;

    // OTP valid for 10 minutes
    user.resetOtpExpire = new Date(
      Date.now() + 10 * 60 * 1000
    );

    user.resetOtpAttempts = 0;
    user.resetOtpVerified = false;

    // Clear previous reset token
    user.resetToken = null;
    user.resetTokenExpire = null;

    await user.save();

    await sendEmail({
      to: normalizedEmail,
      subject: "CodeArena Password Reset OTP",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
        ">

          <h2 style="color: #111827;">
            CodeArena Password Reset
          </h2>

          <p>
            We received a request to reset your CodeArena password.
          </p>

          <p>
            Your OTP is:
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            text-align: center;
            padding: 20px;
            background: #f3f4f6;
            border-radius: 8px;
            margin: 20px 0;
          ">
            ${otp}
          </div>

          <p>
            This OTP will expire in <strong>10 minutes</strong>.
          </p>

          <p>
            If you did not request a password reset, you can safely ignore this email.
          </p>

          <hr />

          <p style="color: #6b7280; font-size: 13px;">
            CodeArena Team
          </p>

        </div>
      `,
    });

    res.json({
      message: "OTP sent successfully to your email.",
    });
  } catch (error) {
    console.error("Forgot Password Error:", error);

    res.status(500).json({
      message: "Unable to send OTP. Please try again later.",
    });
  }
};

// ===============================
// VERIFY OTP
// ===============================
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (user.resetOtpAttempts >= 5) {
      return res.status(429).json({
        message:
          "Too many OTP attempts. Please request a new OTP.",
      });
    }

    if (
      !user.resetOtp ||
      !user.resetOtpExpire ||
      user.resetOtpExpire < new Date()
    ) {
      return res.status(400).json({
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    const hashedOtp = crypto
      .createHash("sha256")
      .update(otp.trim())
      .digest("hex");

    if (hashedOtp !== user.resetOtp) {
      user.resetOtpAttempts += 1;
      await user.save();

      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // OTP verified
    user.resetOtpVerified = true;
    user.resetOtp = null;
    user.resetOtpExpire = null;
    user.resetOtpAttempts = 0;

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetToken = hashedResetToken;

    // Reset token valid for 10 minutes
    user.resetTokenExpire = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await user.save();

    res.json({
      message: "OTP verified successfully.",
      resetToken,
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

// ===============================
// RESET PASSWORD
// ===============================
export const resetPassword = async (req, res) => {
  try {
    const {
      email,
      resetToken,
      newPassword,
    } = req.body;

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({
        message:
          "Email, reset token and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const hashedResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    const user = await User.findOne({
      email: normalizedEmail,
      resetToken: hashedResetToken,
      resetTokenExpire: {
        $gt: new Date(),
      },
      resetOtpVerified: true,
    });

    if (!user) {
      return res.status(400).json({
        message:
          "Reset session is invalid or expired. Please start again.",
      });
    }

    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    user.password = hashedPassword;

    // Clear reset data
    user.resetOtp = null;
    user.resetOtpExpire = null;
    user.resetOtpAttempts = 0;
    user.resetOtpVerified = false;
    user.resetToken = null;
    user.resetTokenExpire = null;

    await user.save();

    res.json({
      message:
        "Password reset successfully. You can now login.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};

export default register;