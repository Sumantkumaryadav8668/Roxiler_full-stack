const { isValidEmail, isValidName, isValidAddress } = require('./authValidator');

const validateAddStore = (data) => {
    const errors = [];
    const { name, email, address, owner_id } = data;

    if (!name || typeof name !== 'string' || name.trim().length < 20 || name.trim().length > 60) {
        errors.push('Store Name must be between 20 and 60 characters.');
    }

    if (!email || !isValidEmail(email)) {
        errors.push('Please provide a valid email address.');
    }

    if (!address || !isValidAddress(address)) {
        errors.push('Address is required and must not exceed 400 characters.');
    }

    if (owner_id !== undefined && owner_id !== null && owner_id !== '') {
        const parsedId = parseInt(owner_id, 10);
        if (isNaN(parsedId) || parsedId <= 0) {
            errors.push('Invalid Owner ID specified.');
        }
    }

    return {
        isValid: errors.length === 0,
        errors
    };
};

const validateRating = (rating) => {
    const numRating = Number(rating);
    if (!Number.isInteger(numRating) || numRating < 1 || numRating > 5) {
        return {
            isValid: false,
            error: 'Rating must be an integer between 1 and 5.'
        };
    }
    return { isValid: true };
};

module.exports = {
    validateAddStore,
    validateRating
};
