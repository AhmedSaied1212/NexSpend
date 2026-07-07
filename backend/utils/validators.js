 
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                success: false,
                error: "Please provide a valid email address"
            };
        };
        return null 
    }


     const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

        if (!passwordRegex.test(password)) {
            return {
                success: false,
                error: "Password must be at least 8 characters long, and contain at least one uppercase letter, one number, and one special character."
            };
        };
        return null;
     }

module.exports = { validateEmail, validatePassword };