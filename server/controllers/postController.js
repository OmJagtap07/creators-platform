import Post from '../models/Post.js';

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
    try {
        const { title, content, category, status } = req.body;

        // Validate required fields
        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: 'Please provide a title and content',
            });
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
        console.error('Create post error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating post',
            error: error.message,
        });
    }
};

// @desc    Get posts for the logged-in user with pagination
// @route   GET /api/posts?page=1&limit=10
// @access  Private
export const getPosts = async (req, res) => {
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
        console.error('Get posts error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching posts',
            error: error.message,
        });
    }
};
