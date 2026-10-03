const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization || req.headers.Authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No authentication token provided.'
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'roxiler_secret_jwt_key_2026_super_secure'
        );

        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token. Please log in again.'
        });
    }
};

module.exports = {
    verifyToken
};
