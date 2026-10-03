const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const generateToken = require('../utils/generateToken');
const { validateSignup, validateLogin, validateChangePassword } = require('../validators/authValidator');




const signup = async (req, res, next) => {
    try {
        const { isValid, errors } = validateSignup(req.body);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        const { name, email, password, address } = req.body;

        
        const existingUser = await UserModel.findByEmail(email.trim().toLowerCase());
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User with this email already exists.'
            });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        
        const userId = await UserModel.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            address: address.trim(),
            role: 'USER'
        });

        const token = generateToken(userId, 'USER');

        return res.status(201).json({
            success: true,
            message: 'User registered successfully.',
            data: {
                token,
                user: {
                    id: userId,
                    name: name.trim(),
                    email: email.trim().toLowerCase(),
                    address: address.trim(),
                    role: 'USER'
                }
            }
        });
    } catch (err) {
        next(err);
    }
};




const login = async (req, res, next) => {
    try {
        const { isValid, errors } = validateLogin(req.body);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        const { email, password } = req.body;

        
        const user = await UserModel.findByEmail(email.trim().toLowerCase());
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password.'
            });
        }

        const token = generateToken(user.id, user.role);

        return res.status(200).json({
            success: true,
            message: 'Login successful.',
            data: {
                token,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    address: user.address,
                    role: user.role
                }
            }
        });
    } catch (err) {
        next(err);
    }
};




const logout = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Logout successful.'
    });
};




const changePassword = async (req, res, next) => {
    try {
        const { isValid, errors } = validateChangePassword(req.body);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        
        const user = await UserModel.findByIdWithPassword(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Current password does not match.'
            });
        }

        
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await UserModel.updatePassword(userId, hashedPassword);

        return res.status(200).json({
            success: true,
            message: 'Password changed successfully.'
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    signup,
    login,
    logout,
    changePassword
};
