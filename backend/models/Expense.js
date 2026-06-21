const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
    amount: {type: Number, required: true},
    type: {type: String, required: true, enum: ["income", "expense"]},
    category: {type: String, required: true},
    date: {type: Date, required: true},
    description: {type: String, required: true},
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;