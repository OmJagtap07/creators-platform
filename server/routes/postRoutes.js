import express from 'express';
import { protect } from '../middleware/auth.js';
import { createPost, getPosts } from '../controllers/postController.js';

const router = express.Router();

// @route   POST /api/posts  — Create a new post (protected)
// @route   GET  /api/posts  — Get paginated posts for logged-in user (protected)
router.post('/', protect, createPost);
router.get('/', protect, getPosts);

export default router;
