import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters'],
        },
        content: {
            type: String,
            required: [true, 'Content is required'],
            minlength: [10, 'Content must be at least 10 characters'],
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true, // Index for filtering posts by author
        },
        category: {
            type: String,
            enum: ['Technology', 'Lifestyle', 'Travel', 'Food'],
            default: 'Technology',
        },
        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft',
        },
        coverImage: {
            type: String,
            default: null, // Optional — text-only posts store null
        },
    },
    {
        timestamps: true, // Adds createdAt and updatedAt automatically
    }
);

// Compound index: optimises "posts by author, newest first" (the most common query)
postSchema.index({ author: 1, createdAt: -1 });

// Single-field index: optimises global feed sorted by time
postSchema.index({ createdAt: -1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
