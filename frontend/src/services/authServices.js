import api from "./api";
import toast from "react-hot-toast";

const authServices = {
    login: async (credentials) => {
        try {
            const response = await api.post("auth/login", credentials);
            const data = await response.json();
            if(data.success) {
                toast.success(data.message);
                return data
            } else {
                toast.error(data.error)
            }   
        } catch (error) {
            toast.error(error.message)
        }
    },

    register: async (credentials) => {
        try {
            const response = await api.post("auth/register", credentials);
            const data = await response.json();
            if(data.success) {
                toast.success(data.message);
                return data
            } else {
                toast.error(data.error)
            }   
        } catch (error) {
            toast.error(error.message)
        }
    },

    profile: async () => {
        try {
            const response = await api.get("auth/me");
            const data = await response.json();
            if(data.success) {
                return data
            }
        } catch (error) {
            toast.error(error.message)
        }
    },

    logout: async (credentials) => {
        try {
            const response = await api.post("auth/logout");
            const data = await response.json();
            if(data.success) {
                toast.success(data.message);
                return data
            } else {
                toast.error(data.error)
            }   
        } catch (error) {
            toast.error(error.message)
        }
    },



}

export default authServices;