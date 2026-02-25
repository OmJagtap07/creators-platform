import express from 'express';
import {
    registerUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
} from '../controllers/userController.js';

const router = express.Router();

// POST /api/users/register - Register a new user
router.post('/register', registerUser);

// GET /api/users - Get all users
router.get('/', getAllUsers);

// GET /api/users/:id - Get a user by ID
router.get('/:id', getUserById);

// PUT /api/users/:id - Update a user
router.put('/:id', updateUser);

// DELETE /api/users/:id - Delete a user
router.delete('/:id', deleteUser);

export default router;
