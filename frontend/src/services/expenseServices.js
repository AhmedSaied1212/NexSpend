import toast from "react-hot-toast";
import api from "./api";

const expenseServices = {
    getExpenses: async () => {
        try {
            const response = await api.get("expense");
            const data = await response.json();
            if(data.success) {
                return data;
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error(error.message);
        }
    },

    createExpense: async (credentials) => {
        try {
            const response = await api.post("expense", credentials);
            const data = await response.json();
            if(data.success) {
                toast.success(data.message)
                return data;
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error(error.message)
        }
    },

    editExpense: async (id, credentials) => {
        try {
            const response = await api.put("expense", id, credentials);
            const data = await response.json();
            if(data.success) {
                toast.success(data.message)
                return data;
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error(error.message)
        }
    },

    deleteExpense: async (id) => {
        try {
            const response = await api.delete("expense", id);
            const data = await response.json();
            if(data.success) {
                toast.success(data.message)
                return data;
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error(error.message)
        }
    },

    getExpense: async (id) => {
        try {
            const response = await api.get(`expense/${id}`);
            const data = await response.json();
            if(data.success) {
                return data;
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

};

export default expenseServices;