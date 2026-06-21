const express = require("express");
const route = express.Router();
const { createExpense, getExpenses, deleteExpense, updatedExpense, getExpenseById } = require("../controllers/expenseController");
const protect = require("../middlewares/auth");

route.post("/", protect, createExpense);
route.get("/", protect, getExpenses);
route.delete("/:id", protect, deleteExpense);
route.put("/:id", protect, updatedExpense);
route.get("/:id", protect, getExpenseById);

module.exports = route;