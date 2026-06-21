const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body; 
        if(!name || !email || !password) {
            return res.status(400).json({
                success: false,
                error: "All credentials are required"
            })
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: "Please provide a valid email address"
            });
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                success: false,
                error: "Password must be at least 8 characters long, and contain at least one uppercase letter, one number, and one special character."
            });
        }
        const exisitEmail = await User.findOne({ email });
        if(exisitEmail) {
            return res.status(401).json({
                success: false,
                error: "Email may be in use, try another email"
            })
        }
        const newUser = await User.create({name, email, password});
        res.status(201).json({
            success: true,
            message: "you have successfully registerd",
            data: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error
        });
        console.log(error)
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Email and password are required"
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                error: "Please provide a valid email address"
            });
        }
        const user = await User.findOne({ email});
        if (!user) {
        return res.status(401).json({
            success: false,
            error: "Invalid credentials"
        });
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

module.exports = {register, login, profile, logout};