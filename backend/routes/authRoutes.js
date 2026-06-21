const express = require("express");
const route = express.Router();
const {register, login, profile, logout} = require("../controllers/authController");
const protect = require("../middlewares/auth");

route.post("/register", register);
route.post("/login", login);
route.get("/me", protect, profile);
route.post("/logout", protect, logout);

module.exports = route;