const Expense = require("../models/Expense")

const createExpense = async (req, res) => {
    try {
        const { amount, type, category, date, description } = req.body;
        const user  = req.user.id;
        if(!amount || !type || !category || !date) {
            return res.status(400).json({
                success: false,
                error: "amount and type and category and date are required"
            })
        } else {
            const newExpense = await Expense.create({
                amount,
                type,
                category,
                date, 
                description,
                user
            });

            return res.status(201).json({
                success: true,
                message: "Expense created successfully",
                data: newExpense
            });
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }

};

const getExpenses = async (req, res) => {
    try {
        const user  = req.user.id;
        const expenses = await Expense.find({
            user
        });
        return res.status(200).json({
            success: true,
            message: "Expense fetched successfully",
            data: expenses
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }

};

const deleteExpense = async (req, res) => {
    try {
        const { id } = req.params;
        const user  = req.user.id;
        if(!id) {
            return res.status(400).json({
                success: false,
                error: "Id are required"
            })
        } else {
            const deletedExpense = await Expense.findOneAndDelete({
                _id: id,
                user
            });
            if(!deletedExpense) {
                return res.status(404).json({
                    success: false,
                    error: "Expense not found"
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "Expense deleted successfully",
                    data: deletedExpense
                });
            }
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }

};

const updatedExpense = async (req, res) => {
    try {
        const { amount, type, category, date, description } = req.body;
        const { id } = req.params;
        const user  = req.user.id;
        if(!amount || !type || !category || !date) {
            return res.status(400).json({
                success: false,
                error: "amount and type and category and date are required"
            })
        } 
        if(!id) {
            return res.status(400).json({
                success: false,
                error: "Id are required"
            })
        } else {
            const editedExpense = await Expense.findOneAndUpdate(
                {
                    _id: id,
                    user
                },
                {
                    amount,
                    type,
                    category,
                    date,
                    description
                },  
                {
                    new: true
                }

            );

            if(!editedExpense) {
                return res.status(404).json({
                    success: false,
                    error: "Expense not found"
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "Expense updated successfully",
                    data: editedExpense
                });
            }
        }

        

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }

};

const getExpenseById = async (req, res) => {
    try {
        const { id } = req.params;
        const user  = req.user.id;
        if(!id) {
            return res.status(400).json({
                success: false,
                error: "Id are required"
            })
        } else {
            const expense = await Expense.findOne({
                _id: id,
                user
            });
            if(!expense) {
                return res.status(404).json({
                    success: false,
                    error: "Expense not found"
                });
            } else {
                return res.status(200).json({
                    success: true,
                    message: "Expense fetched successfully",
                    data: expense
                });
            }
        }

    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message
        })
    }

};


module.exports = { createExpense, getExpenses, deleteExpense, updatedExpense, getExpenseById }