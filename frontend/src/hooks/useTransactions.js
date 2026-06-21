import { useState } from "react";
import toast from "react-hot-toast";
import expenseServices from "../services/expenseServices";

const useTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [type, setType] = useState("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [deleteLoadingId, setDeleteLoadingId] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [transactionDetails, setTransactionDetails] = useState(null)

  const resetForm = () => {
    setType("expense");
    setDescription("");
    setAmount(0);
    setCategory("");
    setDate("");
    setIsEditing(false);
    setEditId(null);
    setIsModalOpen(false)
    setDeleteId(null);
    setIsDeleteOpen(false);
  };

  const addTransaction = async () => {
    setLoading(true);
    try {
      if (!type || !description || !amount || !category || !date) {
        toast.error("All fields are required");
        return;
      }

      const data = await expenseServices.createExpense({
        type,
        description,
        amount,
        category,
        date,
      });

      if (data.success) {
        setTransactions((prev) => [...prev, data.data]);
        resetForm();
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const editTransaction = (id) => {
    const transaction = transactions.find((t) => t._id === id);
    if (!transaction) return;

    setIsEditing(true);
    setEditId(id);
    setIsModalOpen(true)
    setAmount(transaction.amount);
    setCategory(transaction.category);
    setType(transaction.type);
    setDescription(transaction.description);
    setDate(transaction.date.split("T")[0]);
  };

  const saveTransaction = async () => {
    setLoading(true);
    try {
      if (!type || !description || !amount || !category || !date) {
        toast.error("All fields are required");
        return;
      } else {
        const data = await expenseServices.editExpense(editId, {
          type,
          description,
          amount,
          category,
          date,
        });

        if (data.success) {
          setTransactions((prev) =>
            prev.map((t) => (t._id === editId ? data.data : t))
          );
          await getTransactionDetails(editId);
          resetForm();
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id) => {
    setDeleteLoadingId(id);

    try {
      const data = await expenseServices.deleteExpense(id);

      if (data.success) {
        setTransactions((prev) => prev.filter((t) => t._id !== id));
        return true;
      }

      return false;
    } catch (error) {
      toast.error(error.message);
      return false;
    } finally {
      setDeleteLoadingId(null);
    }
  };

  const getTransactions = async () => {
    setIsLoading(true);
    try {
      const data = await expenseServices.getExpenses();

      if (data.success) {
        setTransactions(data.data);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const getTransactionDetails = async (id) => {
    setIsLoading(true);
    try {
      const data = await expenseServices.getExpense(id);

      if (data.success) {
        setTransactionDetails(data.data);
      } else {
        setTransactionDetails(null);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    transactions,
    setTransactions,
    transactionDetails,
    setTransactionDetails,
    isLoading,
    loading,
    setIsEditing,
    type,
    setType,
    description,
    setDescription,
    amount,
    setAmount,
    category,
    setCategory,
    date,
    setDate,
    setEditId,
    setIsModalOpen,
    isModalOpen,
    isEditing,
    deleteLoadingId,
    isDeleteOpen,
    setIsDeleteOpen,
    deleteId,
    setDeleteId,
    resetForm,
    addTransaction,
    editTransaction,
    saveTransaction,
    deleteTransaction,
    getTransactions,
    getTransactionDetails
  };
};

export default useTransactions;