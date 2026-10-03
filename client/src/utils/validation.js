export const validateName = (name) => {
    if (!name || typeof name !== 'string') return 'Name is required.';
    const trimmed = name.trim();
    if (trimmed.length < 20) return 'Name must be at least 20 characters long.';
    if (trimmed.length > 60) return 'Name cannot exceed 60 characters.';
    return null;
};

export const validateEmail = (email) => {
    if (!email || typeof email !== 'string') return 'Email is required.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) return 'Please enter a valid email address.';
    return null;
};

export const validatePassword = (password) => {
    if (!password || typeof password !== 'string') return 'Password is required.';
    if (password.length < 8 || password.length > 16) {
        return 'Password must be between 8 and 16 characters.';
    }
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\];':"\\|,.<>\/?]/.test(password);

    if (!hasUppercase) return 'Password must contain at least one uppercase letter.';
    if (!hasSpecialChar) return 'Password must contain at least one special character.';
    return null;
};

export const validateAddress = (address) => {
    if (!address || typeof address !== 'string' || address.trim() === '') {
        return 'Address is required.';
    }
    if (address.trim().length > 400) {
        return 'Address cannot exceed 400 characters.';
    }
    return null;
};

export const validateRating = (rating) => {
    const num = Number(rating);
    if (!Number.isInteger(num) || num < 1 || num > 5) {
        return 'Rating must be an integer between 1 and 5.';
    }
    return null;
};
