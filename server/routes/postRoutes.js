import express from 'express';
import { protect } from '../middleware/auth.js';
import {
    createPost,
    getPosts,
    getPostById,
    updatePost,
    deletePost,
} from '../controllers/postController.js';

// Export a function that receives the `io` instance so routes can emit events
const postRoutes = (io) => {
    const router = express.Router();

    // Collection routes (specific before parameterised)
    router.post('/', protect, (req, res, next) => createPost(req, res, next, io));
    router.get('/', protect, getPosts);

    // Single-resource routes
    router.get('/:id', protect, getPostById);    // Get post by ID
    router.put('/:id', protect, updatePost);     // Update post
    router.delete('/:id', protect, deletePost);  // Delete post

    return router;
};

export default postRoutes;
