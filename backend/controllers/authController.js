const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validateEmail, validatePassword } = require("../utils/validators");
const nodemailer = require("nodemailer");
const multer = require('multer');;
const cloudinary = require("../config/cloudinary");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body; 
        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: "All credentials are required"
            })
        };

        const emailVaildation = validateEmail(email);

        if(emailVaildation) {
            return res.status(400).json(emailVaildation)
        }

        const passwordValidation = validatePassword(password);

        if(passwordValidation) {
            return res.status(400).json(passwordValidation)
        }

        const exisitEmail = await User.findOne({ email });
        if(exisitEmail) {
            return res.status(401).json({
                success: false,
                error: "Email may be in use, try another email"
            })
        } else {
            const newUser = await User.create({ 
                name,
                email,
                password,
                isVerified: false,
            });

            const token = jwt.sign(
            {
                id: newUser._id,
                purpose: "verify-email"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "15m"
            }
            );

            newUser.verificationToken = token;
            newUser.lastVerificationEmailSentAt = Date.now();
            await newUser.save();

            const verifyUrl = `http://localhost:5173/verify-email?token=${token}`;
            
            await transporter.sendMail({
                from: `NexSpend <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Verify your NexSpend account",
                text: `Welcome to NexSpend! Verify your email by opening this link: ${verifyUrl}`,
                html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center; color: #1f2937;">
                    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e5e7eb;">
                        
                        <!-- Logo / Brand Header -->
                        <h1 style="font-size: 24px; font-weight: 800; color: #000000; margin-top: 0; margin-bottom: 24px; letter-spacing: -0.025em;">
                            Nex<span style="color: #6366f1;">Spend</span>
                        </h1>
                        
                        <div style="height: 1px; background-color: #f3f4f6; margin-bottom: 24px;"></div>
                        
                        <!-- Content -->
                        <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 12px;">Verify your email address</h2>
                        <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-top: 0; margin-bottom: 28px;">
                            Thanks for signing up! Click the button below to secure your account and get started with NexSpend.
                        </p>
                        
                        <!-- CTA Button -->
                        <div style="margin-bottom: 32px;">
                            <a href="${verifyUrl}" style="background-color: #6366f1; color: #ffffff; padding: 12px 28px; font-size: 15px; font-weight: 500; text-decoration: none; border-radius: 8px; display: inline-block; transition: background-color 0.2s ease;">
                                Verify Email
                            </a>
                        </div>
                        
                        <div style="height: 1px; background-color: #f3f4f6; margin-bottom: 20px;"></div>
                        
                        <!-- Fallback Link -->
                        <p style="font-size: 12px; line-height: 1.5; color: #9ca3af; margin: 0;">
                            If the button doesn't work, copy and paste this link into your browser:<br>
                            <a href="${verifyUrl}" style="color: #6366f1; text-decoration: underline;">${verifyUrl}</a>
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <p style="font-size: 12px; color: #9ca3af; margin-top: 24px; margin-bottom: 0;">
                        &copy; ${new Date().getFullYear()} NexSpend. All rights reserved.
                    </p>
                </div>
                `
            });
            return res.status(201).json({
                success: true,
                message: "Registration successful. Please verify your email.",
                data: {
                    id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    isVerified: false
                }
            });
        }


    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        if(!token) {
            return res.status(400).json({
                success: false,
                error: "No token provided."
            })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        const user = await User.findById(decoded.id);

        if(!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            })
        }

        if (!user.verificationToken || user.verificationToken !== token || user.isVerified) {
            return res.status(400).json({
                success: false,
                error: "This verification link has already been used or is expired."
            })
        }

        user.isVerified = true;
        user.verificationToken = undefined;

        await user.save();
        return res.status(200).json({
            success: true,
            message: "You have verified your account successfully."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Email and password are required"
            });
        }

        const error = validateEmail(email);

        if(error) {
            return res.status(400).json(error)
        }

        const user = await User.findOne({ email});
        if (!user) {
        return res.status(401).json({
            success: false,
            error: "Invalid credentials"
        });
        }

        if(!user.isVerified) {
            return res.status(401).json({
                success: false,
                error: "Verify your account first."
            })
        }

        const isMatch = await bcrypt.compare(
        password,
        user.password
        );

        if (!isMatch) {
        return res.status(401).json({
            success: false,
            error: "Invalid credentials"
        });
        }

        const token = jwt.sign(
        {
            id: user._id,
            email: user.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
        );
        const isProduction = process.env.NODE_ENV === 'production';
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: isProduction ? "none" : "lax",
            secure: isProduction,
            maxAge: 7 * 24 * 60 * 60 * 1000
            });

        return res.status(200).json({
        success: true,
        message: "you have logged in successfully",
        user: {
            id: user._id,
            name: user.name,
            email: user.email
        }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const resendVerification = async (req, res) => {
    try {
        const { email } = req.body; 
        if(!email) {
            return res.status(400).json({
                success: false,
                error: "Email are required"
            })
        };

        const emailVaildation = validateEmail(email);

        if(emailVaildation) {
            return res.status(400).json(emailVaildation)
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(401).json({
                success: false,
                error: "User not found."
            })
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                error: "You have already verified you account."
            })
        } 
        const oneMinute = 60 * 1000;

        if (
        user.lastVerificationEmailSentAt &&
        Date.now() - user.lastVerificationEmailSentAt < oneMinute
        ) {
            return res.status(400).json({
                success: false,
                error: "Please wait 1 minuate and try again"
            })
        }

        const token = jwt.sign(
        {
            id: user._id,
            purpose: "verify-email"
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "15m"
        }
        );

        user.verificationToken = token;
        user.lastVerificationEmailSentAt = Date.now()
        await user.save();

        const verifyUrl = `http://localhost:5173/verify-email?token=${token}`;
        
            await transporter.sendMail({
                from: `NexSpend <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Verify your NexSpend account",
                text: `Welcome to NexSpend! Verify your email by opening this link: ${verifyUrl}`,
                html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center; color: #1f2937;">
                    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e5e7eb;">
                        
                        <!-- Logo / Brand Header -->
                        <h1 style="font-size: 24px; font-weight: 800; color: #000000; margin-top: 0; margin-bottom: 24px; letter-spacing: -0.025em;">
                            Nex<span style="color: #6366f1;">Spend</span>
                        </h1>
                        
                        <div style="height: 1px; background-color: #f3f4f6; margin-bottom: 24px;"></div>
                        
                        <!-- Content -->
                        <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 12px;">Verify your email address</h2>
                        <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-top: 0; margin-bottom: 28px;">
                            Thanks for signing up! Click the button below to secure your account and get started with NexSpend.
                        </p>
                        
                        <!-- CTA Button -->
                        <div style="margin-bottom: 32px;">
                            <a href="${verifyUrl}" style="background-color: #6366f1; color: #ffffff; padding: 12px 28px; font-size: 15px; font-weight: 500; text-decoration: none; border-radius: 8px; display: inline-block; transition: background-color 0.2s ease;">
                                Verify Email
                            </a>
                        </div>
                        
                        <div style="height: 1px; background-color: #f3f4f6; margin-bottom: 20px;"></div>
                        
                        <!-- Fallback Link -->
                        <p style="font-size: 12px; line-height: 1.5; color: #9ca3af; margin: 0;">
                            If the button doesn't work, copy and paste this link into your browser:<br>
                            <a href="${verifyUrl}" style="color: #6366f1; text-decoration: underline;">${verifyUrl}</a>
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <p style="font-size: 12px; color: #9ca3af; margin-top: 24px; margin-bottom: 0;">
                        &copy; ${new Date().getFullYear()} NexSpend. All rights reserved.
                    </p>
                </div>
                `
            });

        return res.status(201).json({
            success: true,
            message: "We have resend email verificarion successfully. Please verify your email.",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const profile = async (req, res) => {
    try {
        const user = req.user.id;
        const userData = await User.findById(user).select("-password");
        if(!userData) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            })
        }
        return res.status(200).json({
            success: true,
            message: "user fetched successfully",
            data: userData
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }

};

const logout = async (req, res) => {
    try {
    const isProduction = process.env.NODE_ENV === 'production';
    res.clearCookie('token', {
        httpOnly: true,
        sameSite: isProduction ? "none" : "lax",
        secure: isProduction
    });
    return res.status(200).json({
        success: true,
        message: "logout successfull"
    })
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }
};

const changePassword = async (req, res) => {
    try {
        const { password, newPassword } = req.body;

        if (!newPassword || !password) {
            return res.status(400).json({
                success: false,
                error: "All fields are required"
            });
        }

        const error = validatePassword(newPassword);

        if (error) {
            return res.status(400).json(error);
        }

        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            })
        }

        const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
        );

        if (!isPasswordCorrect) {
        return res.status(401).json({
            success: false,
            error: "Invalid credentials"
        });
        }


        const isSamePassword = await bcrypt.compare(newPassword, user.password)

        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                error: "New password must be different from the current password."
            })
        }

        user.password = newPassword;
        await user.save();

        return res.status(200).json({
        success: true,
        message: "password changed successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const emailVaildation = validateEmail(email) ;

        if(emailVaildation) {
            return res.status(400).json(emailVaildation)
        };

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(404).json({
                success: false,
                error: "User not found."
            })
        };

        const token = jwt.sign({
            id: user._id,
            purpose: "reset-password"
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "10m"
        });

        user.resetPasswordToken = token;
        user.lastForgotPasswordSentAt = Date.now();
        await user.save();

        const verifyUrl = `http://localhost:5173/reset-password?token=${token}`;

            await transporter.sendMail({
                from: `NexSpend <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Reset your password NexSpend account",
                text: `Welcome to NexSpend! Verify your email by opening this link: ${verifyUrl}`,
                html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center; color: #1f2937;">
                    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e5e7eb;">
                        
                        <!-- Logo / Brand Header -->
                        <h1 style="font-size: 24px; font-weight: 800; color: #000000; margin-top: 0; margin-bottom: 24px; letter-spacing: -0.025em;">
                            Nex<span style="color: #6366f1;">Spend</span>
                        </h1>
                        
                        <div style="height: 1px; background-color: #f3f4f6; margin-bottom: 24px;"></div>
                        
                        <!-- Content -->
                        <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 12px;">Verify your email address</h2>
                        <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-top: 0; margin-bottom: 28px;">
                             Click the button below to reset your password.
                        </p>
                        
                        <!-- CTA Button -->
                        <div style="margin-bottom: 32px;">
                            <a href="${verifyUrl}" style="background-color: #6366f1; color: #ffffff; padding: 12px 28px; font-size: 15px; font-weight: 500; text-decoration: none; border-radius: 8px; display: inline-block; transition: background-color 0.2s ease;">
                                Reset Your Password
                            </a>
                        </div>
                        
                        <div style="height: 1px; background-color: #f3f4f6; margin-bottom: 20px;"></div>
                        
                        <!-- Fallback Link -->
                        <p style="font-size: 12px; line-height: 1.5; color: #9ca3af; margin: 0;">
                            If the button doesn't work, copy and paste this link into your browser:<br>
                            <a href="${verifyUrl}" style="color: #6366f1; text-decoration: underline;">${verifyUrl}</a>
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <p style="font-size: 12px; color: #9ca3af; margin-top: 24px; margin-bottom: 0;">
                        &copy; ${new Date().getFullYear()} NexSpend. All rights reserved.
                    </p>
                </div>
                `
            });

        return res.status(200).json({
            success: true,
            message: "We have sent reset password link to your email, go check your inbox."
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
};


const resendForgetPassword = async (req, res) => {
    try {
        const { email } = req.body; 

        if(!email) {
            return res.status(400).json({
                success: false,
                error: "Email are required"
            })
        };

        const emailVaildation = validateEmail(email);

        if(emailVaildation) {
            return res.status(400).json(emailVaildation)
        }

        const user = await User.findOne({ email });

        if(!user) {
            return res.status(401).json({
                success: false,
                error: "User not found."
            })
        }

        const oneMinute = 60 * 1000;

        if (
        user.lastForgotPasswordSentAt &&
        Date.now() - user.lastForgotPasswordSentAt < oneMinute
        ) {
            return res.status(400).json({
                success: false,
                error: "Please wait 1 minuate and try again"
            })
        }

        const token = jwt.sign(
        {
            id: user._id,
            purpose: "verify-email"
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "15m"
        }
        );

        user.verificationToken = token;
        user.lastForgotPasswordSentAt = Date.now()
        await user.save();

        const verifyUrl = `http://localhost:5173/reset-password?token=${token}`;
        
            await transporter.sendMail({
                from: `NexSpend <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Reset your password NexSpend account",
                text: `Welcome to NexSpend! Verify your email by opening this link: ${verifyUrl}`,
                html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f9fafb; padding: 40px 20px; text-align: center; color: #1f2937;">
                    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e5e7eb;">
                        
                        <!-- Logo / Brand Header -->
                        <h1 style="font-size: 24px; font-weight: 800; color: #000000; margin-top: 0; margin-bottom: 24px; letter-spacing: -0.025em;">
                            Nex<span style="color: #6366f1;">Spend</span>
                        </h1>
                        
                        <div style="height: 1px; background-color: #f3f4f6; margin-bottom: 24px;"></div>
                        
                        <!-- Content -->
                        <h2 style="font-size: 20px; font-weight: 600; color: #111827; margin-bottom: 12px;">Verify your email address</h2>
                        <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin-top: 0; margin-bottom: 28px;">
                             Click the button below to reset your password.
                        </p>
                        
                        <!-- CTA Button -->
                        <div style="margin-bottom: 32px;">
                            <a href="${verifyUrl}" style="background-color: #6366f1; color: #ffffff; padding: 12px 28px; font-size: 15px; font-weight: 500; text-decoration: none; border-radius: 8px; display: inline-block; transition: background-color 0.2s ease;">
                                Reset Your Password
                            </a>
                        </div>
                        
                        <div style="height: 1px; background-color: #f3f4f6; margin-bottom: 20px;"></div>
                        
                        <!-- Fallback Link -->
                        <p style="font-size: 12px; line-height: 1.5; color: #9ca3af; margin: 0;">
                            If the button doesn't work, copy and paste this link into your browser:<br>
                            <a href="${verifyUrl}" style="color: #6366f1; text-decoration: underline;">${verifyUrl}</a>
                        </p>
                    </div>
                    
                    <!-- Footer -->
                    <p style="font-size: 12px; color: #9ca3af; margin-top: 24px; margin-bottom: 0;">
                        &copy; ${new Date().getFullYear()} NexSpend. All rights reserved.
                    </p>
                </div>
                `
            });

        return res.status(201).json({
            success: true,
            message: "We have resend reset password link successfully. Please check your email.",
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { token } = req.query;
        const { newPassword } = req.body;

        if(!token) {
            return res.status(400).json({
                success: false,
                error: "No token provided."
            })
        }

        if(!newPassword) {
            return res.status(400).json({
                success: false,
                error: "New Password are required."
            })
        }

        const passwordValidation = validatePassword(newPassword);

        if(passwordValidation) {
            return res.status(400).json(passwordValidation)
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(!decoded) {
            return res.status(400).json({
                success: false,
                error: "Invalid token"
            })
        }

        const user = await User.findById(decoded.id);

        if(!user) {
            return res.status(404).json({
                success: false,
                error: "User not found"
            })
        }

        if (!user.resetPasswordToken || user.resetPasswordToken !== token) {
            return res.status(400).json({
                success: false,
                error: "This verification link has already been used or is expired."
            })
        }

        const isSamePassword = await bcrypt.compare(newPassword, user.password)

        if (isSamePassword) {
            return res.status(400).json({
                success: false,
                error: "New password must be different from the current password."
            })
        }

        user.resetPasswordToken = undefined;

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "You have reset your password successfully."
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
};

const uploadProfilePhoto = async (req, res) => {
    try {
    const user = req.user.id

    if (!user) {
        return res.status(404).json({
            success: false,
            error: "User not found."
        })
    }
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    // Convert buffer to base64 Data URI string to send to Cloudinary
    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

    // Upload to Cloudinary with profile picture optimization settings
    const uploadResult = await cloudinary.uploader.upload(fileBase64, {
      folder: 'user_profiles', // Organizes files into a specific folder
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' }, // Automatically crops around the face
        { quality: 'auto' }, // Compresses file size natively
        { fetch_format: 'auto' } // Serves optimal format based on user's browser
      ]
    });

    // Extract the optimized URL
    const imageUrl = uploadResult.secure_url;

    await User.findByIdAndUpdate(
        user,
        {
            profilePhoto: imageUrl
        }
    );

    return res.status(200).json({
        success: true,
        message: "Profile photo updated succeessfully.",
        image_url: imageUrl
    });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
};

module.exports = { register, login, profile, logout, changePassword, verifyEmail, forgotPassword, resetPassword, resendVerification, resendForgetPassword, uploadProfilePhoto};