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

    logout: async () => {
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

    verifyEmail: async (token) => {
        try {
            const response = await api.get(`auth/verify-email?token=${token}`);
            const data = await response.json();
            if(data.success) {
                toast.success(data.message);
                return data
            } else {
                toast.error(data.error);
            }   
        } catch (error) {
            toast.error(error.message)
        }
    },

    resendVerification: async (email) => {
        try {
            const response = await api.post("auth/resend-verification", { email });
            const data = await response.json();
            if(!response.ok) {
                toast.error(data.error);
            } else {
                toast.success(data.message);
                return data
            }  
        } catch (error) {
            toast.error(error.message)
        } 
    },

    changePassword: async (credentials) => {
        try {
            const response = await api.patch("auth/password", credentials);
            const data = await response.json();
            if(data.success) {
                toast.success(data.message);
                return data
            } else {
                toast.error(data.error);
            }   
        } catch (error) {
            toast.error(error.message)
        } 
    },

    forgotPassword: async (email) => {
        try {
            const response = await api.post("auth/forgot-password", { email });
            const data = await response.json();
            if(data.success) {
                toast.success(data.message);
                return data
            } else {
                toast.error(data.error);
            }   
        } catch (error) {
            toast.error(error.message)
        }    
    },

    resendForgot: async (email) => {
        try {
            const response = await api.post("auth/resend-forgot", { email });
            const data = await response.json();
            if(data.success) {
                toast.success(data.message);
                return data
            } else {
                toast.error(data.error);
            }   
        } catch (error) {
            toast.error(error.message)
        }    
    },


    resetPassword: async (token, newPassword) => {
        try {
            const response = await api.patch(`auth/reset-password?token=${token}`, { newPassword });
            const data = await response.json();
            if(data.success) {
                toast.success(data.message);
                return data
            } else {
                toast.error(data.error);
            }   
        } catch (error) {
            toast.error(error.message)
        }    
    },

    uploadProfilePhoto: async (file) => {
        try {
            const formData = new FormData();
            formData.append("image", file); 

            const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/upload`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                toast.success(data.message);
                return data;
            } else {
                toast.error(data.error || "Failed to upload photo");
            }
        } catch (error) {
            toast.error(error.message);
        }
    },

}

export default authServices;