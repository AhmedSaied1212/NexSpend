const express = require("express");
const route = express.Router();
const {
    register,
    login,
    profile,
    logout,
    changePassword,
    verifyEmail,
    forgotPassword,
    resetPassword,
    resendVerification,
    resendForgetPassword,
    uploadProfilePhoto
} = require("../controllers/authController");
const protect = require("../middlewares/auth");
const { rateLimit } = require("express-rate-limit");
const upload = require("../config/multer");

const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: "Too many register attempts"
    }
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: "Too many login attempts"
    }
});

const profileLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        success: false,
        error: "Too many profile requests"
    }
});

const logoutLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: {
        success: false,
        error: "Too many logout attempts"
    }
});

const passwordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: "Too many password change attempts"
    }
});

const verifyEmailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: {
        success: false,
        error: "Too many verification attempts"
    }
});

const forgotPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        error: "Too many forgot password attempts"
    }
});

const resetPasswordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        error: "Too many reset password attempts"
    }
});

const resendVerificationLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        error: "Too many resend verification attempts"
    }
});

const uploadPhotoLimiter = rateLimit({
    windowMs: 120 * 60 * 1000,
    max: 3,
    message: {
        success: false,
        error: "Too many upload photo attempts"
    }
});

route.post("/register", registerLimiter, register);
route.post("/login", loginLimiter, login);
route.get("/me", profileLimiter, protect, profile);
route.post("/logout", logoutLimiter, protect, logout);
route.patch("/password", passwordLimiter, protect, changePassword);
route.get("/verify-email", verifyEmailLimiter, verifyEmail);
route.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
route.patch("/reset-password", resetPasswordLimiter, resetPassword);
route.post("/resend-verification", resendVerificationLimiter, resendVerification);
route.post("/resend-forgot", resendVerificationLimiter, resendForgetPassword);
route.post("/upload", uploadPhotoLimiter, protect, upload.single("image"), uploadProfilePhoto);

module.exports = route;