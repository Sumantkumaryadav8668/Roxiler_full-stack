import StoreModel from '../models/storeModel.js';
import RatingModel from '../models/ratingModel.js';

export const getStores = async (req, res, next) => {
    try {
        const { search, name, address, sortBy, sortOrder } = req.query;
        const querySearch = search || name || address || '';
        const userId = req.user ? req.user.id : null;

        const stores = await StoreModel.getAll({
            search: querySearch,
            userId,
            sortBy: sortBy || 'name',
            sortOrder: sortOrder || 'ASC'
        });

        return res.status(200).json({
            success: true,
            message: 'Stores list retrieved successfully.',
            data: stores
        });
    } catch (err) {
        next(err);
    }
};

export const getStoreById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const store = await StoreModel.findById(id);

        if (!store) {
            return res.status(404).json({
                success: false,
                message: 'Store not found.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Store details fetched successfully.',
            data: store
        });
    } catch (err) {
        next(err);
    }
};

export const getOwnerDashboard = async (req, res, next) => {
    try {
        const ownerId = req.user.id;
        const store = await StoreModel.findByOwnerId(ownerId);

        if (!store) {
            return res.status(404).json({
                success: false,
                message: 'No store associated with this owner account.'
            });
        }

        const ratedUsers = await RatingModel.getStoreOwnerRatings(ownerId);

        return res.status(200).json({
            success: true,
            message: 'Owner dashboard data fetched successfully.',
            data: {
                store,
                averageRating: Number(store.overall_rating) || 0,
                totalRatings: Number(store.total_ratings) || 0,
                ratedUsers
            }
        });
    } catch (err) {
        next(err);
    }
};

export default {
    getStores,
    getStoreById,
    getOwnerDashboard
};
