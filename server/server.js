// ⚠️ dotenv MUST be the very first import — before any module that reads process.env.
// cloudinary.js calls cloudinary.config() during module evaluation (at import time),
// so if dotenv hasn't run yet, CLOUDINARY_API_KEY etc. will be undefined → "Must supply api_key".
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import uploadRoutes from './routes/upload.js';
import errorHandler from './middleware/errorHandler.js';
import timingMiddleware from './middleware/timing.js';

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const allowedOrigins = [
    process.env.CLIENT_URL,
    'http://localhost:5173',
    'http://localhost:5174',
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile apps, curl)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked for origin: ${origin}`));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());

// Performance: log response time for every request
// Slow requests ( > 500ms ) are flagged with 🐌 in the console
app.use(timingMiddleware);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// User routes
app.use('/api/users', userRoutes);

// Auth routes
app.use('/api/auth', authRoutes);

// Upload routes
app.use('/api/upload', uploadRoutes);

// Create HTTP server from Express app (required for Socket.io)
const httpServer = createServer(app);

// Initialize Socket.io — CORS must be configured here separately from Express CORS
const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// ── Socket.io JWT Authentication Middleware ──────────────────────────────────
// Runs before every connection is accepted — verifies the JWT sent by the client
io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication error: No token provided'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach decoded user to socket so all handlers know who is connected
        socket.data.user = decoded;
        next();
    } catch (err) {
        return next(new Error('Authentication error: Invalid or expired token'));
    }
});

// Post routes — pass io so the route can emit Socket.io events
app.use('/api/posts', postRoutes(io));

// 404 handler — must come after all routes
app.use((req, res, next) => {
    const err = new Error(`Route not found: ${req.originalUrl}`);
    err.status = 404;
    next(err);
});

// Global error handler — must be last middleware with exactly 4 params
app.use(errorHandler);

// ── Socket.io connection handling ────────────────────────────────────────────
io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id} | User: ${socket.data.user.email}`);

    // Handle disconnection
    socket.on('disconnect', (reason) => {
        console.log(`❌ User disconnected: ${socket.id} (${reason})`);
    });
});

// Start server on the HTTP server (not app) so Socket.io shares the same port
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔌 Socket.io ready for connections`);
});