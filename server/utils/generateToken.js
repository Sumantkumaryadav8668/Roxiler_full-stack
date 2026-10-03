const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET || 'roxiler_secret_jwt_key_2026_super_secure',
        { expiresIn: '7d' }
    );
};

module.exports = generateToken;
