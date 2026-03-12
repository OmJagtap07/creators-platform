import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import errorHandler from './middleware/errorHandler.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ message: 'Server is running!' });
});

// User routes
app.use('/api/users', userRoutes);

// Auth routes
app.use('/api/auth', authRoutes);

// Post routes
app.use('/api/posts', postRoutes);

// 404 handler — must come after all routes
app.use((req, res, next) => {
    const err = new Error(`Route not found: ${req.originalUrl}`);
    err.status = 404;
    next(err);
});

// Global error handler — must be last middleware with exactly 4 params
app.use(errorHandler);

// Create HTTP server from Express app (required for Socket.io)
const httpServer = createServer(app);

// Initialize Socket.io — CORS must be configured here separately from Express CORS
const io = new Server(httpServer, {
    cors: {
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id}`);

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