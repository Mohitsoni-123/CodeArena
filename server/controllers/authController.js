import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";

// ==========================================
// EMAIL CONFIGURATION
// ==========================================

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,

  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },

  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 15000,
});


// ==========================================
// REGISTER
// ==========================================

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Register Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// LOGIN
// ==========================================

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// GET ME
// ==========================================

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            message: "User fetched successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                streak: user.streak,
                solvedProblems: user.solvedProblems
            }
        });

    } catch (error) {
        console.error("Get Me Error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// ==========================================
// FORGOT PASSWORD - SEND OTP
// ==========================================

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(404).json({
                message: "No account found with this email"
            });
        }

        // Generate 6 digit OTP
        const otp = crypto.randomInt(100000, 1000000).toString();

        // Hash OTP before storing
        const hashedOtp = crypto
            .createHash("sha256")
            .update(otp)
            .digest("hex");

        // OTP valid for 10 minutes
        user.resetOtp = hashedOtp;
        user.resetOtpExpire = new Date(Date.now() + 10 * 60 * 1000);
        user.resetOtpAttempts = 0;
        user.resetOtpVerified = false;

        // Clear old reset token
        user.resetToken = null;
        user.resetTokenExpire = null;

        await user.save();

        // Send OTP email
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: "CodeArena Password Reset OTP",
            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 500px;
                    margin: auto;
                    padding: 30px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                ">
                    <h2 style="text-align:center;">
                        CodeArena Password Reset
                    </h2>

                    <p>Hello ${user.name},</p>

                    <p>
                        We received a request to reset your CodeArena password.
                    </p>

                    <p>
                        Your OTP is:
                    </p>

                    <div style="
                        text-align:center;
                        font-size:32px;
                        font-weight:bold;
                        letter-spacing:8px;
                        padding:20px;
                        background:#f5f5f5;
                        border-radius:8px;
                    ">
                        ${otp}
                    </div>

                    <p>
                        This OTP will expire in <strong>10 minutes</strong>.
                    </p>

                    <p>
                        If you did not request a password reset,
                        you can safely ignore this email.
                    </p>

                    <p>
                        Regards,<br>
                        CodeArena Team
                    </p>
                </div>
            `
        });

        res.status(200).json({
            message: "OTP sent successfully"
        });

    } catch (error) {
        console.error("Forgot Password Error:", error);

        res.status(500).json({
            message: "Unable to send OTP"
        });
    }
};


// ==========================================
// VERIFY OTP
// ==========================================

export const verifyResetOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                message: "Email and OTP are required"
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase().trim()
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Check attempts
        if (user.resetOtpAttempts >= 5) {
            return res.status(429).json({
                message: "Too many incorrect attempts. Please request a new OTP."
            });
        }

        // Check OTP expiry
        if (
            !user.resetOtpExpire ||
            user.resetOtpExpire < new Date()
        ) {
            return res.status(400).json({
                message: "OTP has expired. Please request a new OTP."
            });
        }

        const hashedOtp = crypto
            .createHash("sha256")
            .update(otp.toString())
            .digest("hex");

        // Check OTP
        if (hashedOtp !== user.resetOtp) {

            user.resetOtpAttempts += 1;

            await user.save();

            return res.status(400).json({
                message: "Invalid OTP",
                attemptsLeft: Math.max(
                    0,
                    5 - user.resetOtpAttempts
                )
            });
        }

        // OTP verified
        user.resetOtpVerified = true;

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString("hex");

        user.resetToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        // Reset token valid for 10 minutes
        user.resetTokenExpire = new Date(
            Date.now() + 10 * 60 * 1000
        );

        await user.save();

        res.status(200).json({
            message: "OTP verified successfully",
            resetToken
        });

    } catch (error) {
        console.error("Verify OTP Error:", error);

        res.status(500).json({
            message: "Unable to verify OTP"
        });
    }
};


// ==========================================
// RESET PASSWORD
// ==========================================

export const resetPassword = async (req, res) => {
    try {
        const {
            email,
            resetToken,
            newPassword
        } = req.body;

        if (!email || !resetToken || !newPassword) {
            return res.status(400).json({
                message: "Email, reset token and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        const hashedToken = crypto
            .createHash("sha256")
            .update(resetToken)
            .digest("hex");

        const user = await User.findOne({
            email: email.toLowerCase().trim(),
            resetToken: hashedToken,
            resetTokenExpire: {
                $gt: new Date()
            },
            resetOtpVerified: true
        });

        if (!user) {
            return res.status(400).json({
                message: "Invalid or expired reset token"
            });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(
            newPassword,
            10
        );

        user.password = hashedPassword;

        // Clear reset information
        user.resetOtp = null;
        user.resetOtpExpire = null;
        user.resetOtpAttempts = 0;
        user.resetOtpVerified = false;
        user.resetToken = null;
        user.resetTokenExpire = null;

        await user.save();

        res.status(200).json({
            message: "Password reset successfully"
        });

    } catch (error) {
        console.error("Reset Password Error:", error);

        res.status(500).json({
            message: "Unable to reset password"
        });
    }
};


export default register;