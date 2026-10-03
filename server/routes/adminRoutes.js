const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    addUser,
    addStore,
    getUsers,
    getStores,
    getUserById
} = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');
const { requireRole } = require('../middleware/roleMiddleware');


router.use(verifyToken, requireRole('ADMIN'));

router.get('/dashboard', getDashboardStats);
router.post('/users', addUser);
router.post('/stores', addStore);
router.get('/users', getUsers);
router.get('/stores', getStores);
router.get('/users/:id', getUserById);

module.exports = router;
