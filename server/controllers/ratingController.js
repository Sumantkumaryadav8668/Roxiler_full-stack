const RatingModel = require('../models/ratingModel');
const StoreModel = require('../models/storeModel');
const { validateRating } = require('../validators/storeValidator');




const submitRating = async (req, res, next) => {
    try {
        const { store_id, rating } = req.body;
        const userId = req.user.id;

        if (!store_id) {
            return res.status(400).json({
                success: false,
                message: 'Store ID is required.'
            });
        }

        const ratingCheck = validateRating(rating);
        if (!ratingCheck.isValid) {
            return res.status(400).json({
                success: false,
                message: ratingCheck.error
            });
        }

        
        const store = await StoreModel.findById(store_id);
        if (!store) {
            return res.status(404).json({
                success: false,
                message: 'Store not found.'
            });
        }

        
        await RatingModel.upsert({
            user_id: userId,
            store_id: Number(store_id),
            rating: Number(rating)
        });

        
        const updatedStore = await StoreModel.findById(store_id);

        return res.status(201).json({
            success: true,
            message: 'Rating submitted successfully.',
            data: {
                store_id: Number(store_id),
                submitted_rating: Number(rating),
                new_overall_rating: updatedStore.overall_rating
            }
        });
    } catch (err) {
        next(err);
    }
};




const updateRating = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;
        const userId = req.user.id;

        const ratingCheck = validateRating(rating);
        if (!ratingCheck.isValid) {
            return res.status(400).json({
                success: false,
                message: ratingCheck.error
            });
        }

        const existingRating = await RatingModel.findById(id);
        if (!existingRating) {
            return res.status(404).json({
                success: false,
                message: 'Rating record not found.'
            });
        }

        
        if (existingRating.user_id !== userId && req.user.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'You can only modify your own rating.'
            });
        }

        await RatingModel.update(id, Number(rating));

        
        const updatedStore = await StoreModel.findById(existingRating.store_id);

        return res.status(200).json({
            success: true,
            message: 'Rating updated successfully.',
            data: {
                id: Number(id),
                new_rating: Number(rating),
                store_id: existingRating.store_id,
                new_overall_rating: updatedStore ? updatedStore.overall_rating : null
            }
        });
    } catch (err) {
        next(err);
    }
};




const getStoreRatings = async (req, res, next) => {
    try {
        const { storeId } = req.params;
        const ratings = await RatingModel.getStoreRatings(storeId);

        return res.status(200).json({
            success: true,
            message: 'Store ratings fetched successfully.',
            data: ratings
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    submitRating,
    updateRating,
    getStoreRatings
};
