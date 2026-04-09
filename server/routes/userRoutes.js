import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    registerUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

// POST /api/users/register — Public: no auth needed to sign up
router.post('/register', registerUser);

// GET /api/users — Protected: only authenticated users
router.get('/', protect, getAllUsers);

// GET /api/users/:id — Protected
router.get('/:id', protect, getUserById);

// PUT /api/users/:id — Protected
router.put('/:id', protect, updateUser);

// DELETE /api/users/:id — Protected
router.delete('/:id', protect, deleteUser);

export default router;
