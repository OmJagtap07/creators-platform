import express from 'express';
import { loginUser } from '../controllers/authController.js';

const router = express.Router();

// POST /api/auth/login — Authenticate user and return JWT
router.post('/login', loginUser);

export default router;
