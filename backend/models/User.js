const mongoose = require("mongoose");
const bcrypt = require("bcrypt")
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minLength: 8},
    isVerified: {type: Boolean, required: true, default: false},
    verificationToken: { type: String },
    resetPasswordToken: { type: String },
    lastVerificationEmailSentAt: {type: Date},
    lastForgotPasswordSentAt: {type: Date},
    profilePhoto: {type: String}
},
{
    timestamps: true
}
); 

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("users", userSchema);


module.exports = User;