import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// @desc   Protect routes — verify JWT and attach req.user
// @usage  import { protect } from '../middleware/auth.js';
//         router.get('/', protect, handler);
export const protect = async (req, res, next) => {
    try {
        let token;

        // Extract token from "Authorization: Bearer <token>"
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ')[1];
        }

        // No token provided
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized — no token provided',
            });
        }

        // Verify token signature & expiry
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user to request (exclude password)
        req.user = await User.findById(decoded.userId).select('-password');

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized — user not found',
            });
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Not authorized — token failed',
        });
    }
};
