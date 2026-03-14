import express from 'express';
import cloudinary from '../config/cloudinary.js';
import upload from '../middleware/upload.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// ── Helper: upload a Buffer to Cloudinary via upload_stream ──────────────────
// Cloudinary's uploader.upload() expects a file path or base64 string.
// To send a raw Buffer we must use upload_stream and wrap it in a Promise.
const uploadToCloudinary = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'creator-platform' },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        // Push the buffer into the writable stream to begin the upload
        stream.end(buffer);
    });
};

// ── POST /api/upload ──────────────────────────────────────────────────────────
// Protected: requires a valid Bearer JWT
// Expects: multipart/form-data with field name "image"
router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
        // 1. Ensure a file was actually attached
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded',
            });
        }

        // 2. Forward the in-memory buffer to Cloudinary
        const result = await uploadToCloudinary(req.file.buffer);

        // 3. Return the permanent CDN URL and the asset identifier
        return res.status(200).json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Upload failed',
        });
    }
});

// ── Multer error handler ──────────────────────────────────────────────────────
// Must have exactly 4 parameters — Express identifies error middleware this way.
// Placed AFTER the route so it only catches errors from this router.
router.use((error, req, res, next) => {
    if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
            success: false,
            message: 'File is too large. Maximum size is 5MB.',
        });
    }

    return res.status(400).json({
        success: false,
        message: error.message || 'File upload error',
    });
});

export default router;
