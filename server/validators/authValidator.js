
const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return typeof email === 'string' && emailRegex.test(email.trim());
};





const isValidPassword = (password) => {
    if (typeof password !== 'string') return false;
    if (password.length < 8 || password.length > 16) return false;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\];':"\\|,.<>\/?]/.test(password);
    return hasUppercase && hasSpecialChar;
};

const isValidName = (name) => {
    if (typeof name !== 'string') return false;
    const trimmed = name.trim();
    return trimmed.length >= 20 && trimmed.length <= 60;
};

const isValidAddress = (address) => {
    if (typeof address !== 'string') return false;
    const trimmed = address.trim();
    return trimmed.length > 0 && trimmed.length <= 400;
};

const validateSignup = (data) => {
    const errors = [];
    const { name, email, password, address } = data;

    if (!name || !isValidName(name)) {
        errors.push('Name must be between 20 and 60 characters.');
    }

    if (!email || !isValidEmail(email)) {
        errors.push('Please provide a valid email address.');
    }

    if (!password || !isValidPassword(password)) {
        errors.push('Password must be 8-16 characters and contain at least one uppercase letter and one special character.');
    }

    if (!address || !isValidAddress(address)) {
        errors.push('Address is required and must not exceed 400 characters.');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

const validateLogin = (data) => {
    const errors = [];
    const { email, password } = data;

    if (!email || !isValidEmail(email)) {
        errors.push('Please provide a valid email address.');
    }

    if (!password || typeof password !== 'string' || password.trim() === '') {
        errors.push('Password is required.');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

const validateChangePassword = (data) => {
    const errors = [];
    const { currentPassword, newPassword } = data;

    if (!currentPassword || typeof currentPassword !== 'string' || currentPassword.trim() === '') {
        errors.push('Current password is required.');
    }

    if (!newPassword || !isValidPassword(newPassword)) {
        errors.push('New password must be 8-16 characters and contain at least one uppercase letter and one special character.');
    }

    if (currentPassword === newPassword) {
        errors.push('New password must be different from current password.');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

module.exports = {
    isValidEmail,
    isValidPassword,
    isValidName,
    isValidAddress,
    validateSignup,
    validateLogin,
    validateChangePassword
};
