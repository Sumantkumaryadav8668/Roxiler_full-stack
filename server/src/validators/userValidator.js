import { isValidEmail, isValidPassword, isValidName, isValidAddress } from './authValidator.js';

export const validateAddUser = (data) => {
    const errors = [];
    const { name, email, password, address, role } = data;

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

    const validRoles = ['ADMIN', 'USER', 'STORE_OWNER'];
    if (!role || !validRoles.includes(role)) {
        errors.push('Role must be ADMIN, USER, or STORE_OWNER.');
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

export default {
    validateAddUser
};
