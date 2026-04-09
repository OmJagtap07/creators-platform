import multer from 'multer';

// Keep the file in RAM (Buffer) — never written to disk
// Ideal for forwarding directly to cloud storage like Cloudinary
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5 MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);   // accept
        } else {
            cb(new Error('Only image files are allowed'), false); // reject
        }
    },
});

export default upload;
