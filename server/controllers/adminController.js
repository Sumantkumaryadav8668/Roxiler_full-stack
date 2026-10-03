const bcrypt = require('bcryptjs');
const UserModel = require('../models/userModel');
const StoreModel = require('../models/storeModel');
const RatingModel = require('../models/ratingModel');
const { validateAddUser } = require('../validators/userValidator');
const { validateAddStore } = require('../validators/storeValidator');




const getDashboardStats = async (req, res, next) => {
    try {
        const totalUsers = await UserModel.count();
        const totalStores = await StoreModel.count();
        const totalRatings = await RatingModel.count();

        return res.status(200).json({
            success: true,
            message: 'Dashboard statistics fetched successfully.',
            data: {
                totalUsers,
                totalStores,
                totalRatings
            }
        });
    } catch (err) {
        next(err);
    }
};




const addUser = async (req, res, next) => {
    try {
        const { isValid, errors } = validateAddUser(req.body);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        const { name, email, password, address, role } = req.body;

        
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
            role
        });

        return res.status(201).json({
            success: true,
            message: 'User created successfully.',
            data: {
                id: userId,
                name: name.trim(),
                email: email.trim().toLowerCase(),
                address: address.trim(),
                role
            }
        });
    } catch (err) {
        next(err);
    }
};




const addStore = async (req, res, next) => {
    try {
        const { isValid, errors } = validateAddStore(req.body);
        if (!isValid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors
            });
        }

        const { name, email, address, owner_id } = req.body;

        
        if (owner_id) {
            const owner = await UserModel.findById(owner_id);
            if (!owner) {
                return res.status(404).json({
                    success: false,
                    message: 'Specified owner user does not exist.'
                });
            }
            if (owner.role !== 'STORE_OWNER') {
                return res.status(400).json({
                    success: false,
                    message: 'Assigned owner must have the STORE_OWNER role.'
                });
            }
        }

        const storeId = await StoreModel.create({
            name: name.trim(),
            email: email.trim().toLowerCase(),
            address: address.trim(),
            owner_id: owner_id || null
        });

        return res.status(201).json({
            success: true,
            message: 'Store created successfully.',
            data: {
                id: storeId,
                name: name.trim(),
                email: email.trim().toLowerCase(),
                address: address.trim(),
                owner_id: owner_id || null
            }
        });
    } catch (err) {
        next(err);
    }
};




const getUsers = async (req, res, next) => {
    try {
        const { name, email, address, search, role, sortBy, sortOrder } = req.query;

        
        const querySearch = search || name || email || address || '';

        const users = await UserModel.getAll({
            search: querySearch,
            role,
            sortBy: sortBy || 'name',
            sortOrder: sortOrder || 'ASC'
        });

        return res.status(200).json({
            success: true,
            message: 'Users fetched successfully.',
            data: users
        });
    } catch (err) {
        next(err);
    }
};




const getStores = async (req, res, next) => {
    try {
        const { name, address, search, sortBy, sortOrder } = req.query;
        const querySearch = search || name || address || '';

        const stores = await StoreModel.getAll({
            search: querySearch,
            sortBy: sortBy || 'name',
            sortOrder: sortOrder || 'ASC'
        });

        return res.status(200).json({
            success: true,
            message: 'Stores fetched successfully.',
            data: stores
        });
    } catch (err) {
        next(err);
    }
};




const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found.'
            });
        }

        let storeDetails = null;
        if (user.role === 'STORE_OWNER') {
            storeDetails = await StoreModel.findByOwnerId(user.id);
        }

        return res.status(200).json({
            success: true,
            message: 'User details fetched successfully.',
            data: {
                ...user,
                store: storeDetails
            }
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getDashboardStats,
    addUser,
    addStore,
    getUsers,
    getStores,
    getUserById
};
