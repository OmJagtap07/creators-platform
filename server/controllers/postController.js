import Post from '../models/Post.js';

// Helper: create an error with an HTTP status attached
const createError = (message, status) => {
    const err = new Error(message);
    err.status = status;
    return err;
};

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
    try {
        const { title, content, category, status } = req.body;

        // Validate required fields
        if (!title || !content) {
            return next(createError('Please provide a title and content', 400));
        }

        // Create post — link to authenticated user via req.user (set by protect middleware)
        const post = await Post.create({
            title,
            content,
            category,
            status,
            author: req.user._id,
        });

        res.status(201).json({
            success: true,
            message: 'Post created successfully',
            data: post,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get posts for the logged-in user with pagination
// @route   GET /api/posts?page=1&limit=10
// @access  Private
export const getPosts = async (req, res, next) => {
    try {
        // Parse page & limit from query string (with safe defaults)
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        // Number of documents to skip
        const skip = (page - 1) * limit;

        // Fetch only the authenticated user's posts, newest first
        const posts = await Post.find({ author: req.user._id })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('author', 'name email');

        // Total count for this user (needed to calculate total pages)
        const total = await Post.countDocuments({ author: req.user._id });
        const totalPages = Math.ceil(total / limit);

        res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single post by ID (owner only)
// @route   GET /api/posts/:id
// @access  Private
export const getPostById = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name email');

        if (!post) {
            return next(createError('Post not found', 404));
        }

        // Ownership check
        if (post.author._id.toString() !== req.user._id.toString()) {
            return next(createError('Not authorized to view this post', 403));
        }

        res.status(200).json({
            success: true,
            data: post,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update post (owner only)
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return next(createError('Post not found', 404));
        }

        // Ownership check
        if (post.author.toString() !== req.user._id.toString()) {
            return next(createError('Not authorized to update this post', 403));
        }

        // Only update fields that were sent
        const { title, content, category, status } = req.body;
        if (title) post.title = title;
        if (content) post.content = content;
        if (category) post.category = category;
        if (status) post.status = status;

        const updatedPost = await post.save();

        res.status(200).json({
            success: true,
            message: 'Post updated successfully',
            data: updatedPost,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete post (owner only)
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return next(createError('Post not found', 404));
        }

        // Ownership check
        if (post.author.toString() !== req.user._id.toString()) {
            return next(createError('Not authorized to delete this post', 403));
        }

        await post.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Post deleted successfully',
            data: { id: req.params.id },
        });
    } catch (error) {
        next(error);
    }
};
