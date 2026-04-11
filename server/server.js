// ⚠️ dotenv is loaded inside app.js as the very first import.
// server.js only handles: DB connection, Socket.io, and server startup.

import app from './app.js';
import jwt from 'jsonwebtoken';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import postRoutes from './routes/postRoutes.js';

const PORT = process.env.PORT || 5000;

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── Create HTTP server from Express app (required for Socket.io) ──────────────
const httpServer = createServer(app);

// ── Allowed origins (must match app.js) ──────────────────────────────────────
const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.CLIENT_URL,
    'https://creators-platform-client.vercel.app',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
].filter(Boolean);

// ── Initialize Socket.io ──────────────────────────────────────────────────────
const io = new Server(httpServer, {
    cors: {
        origin: allowedOrigins,
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// ── Socket.io JWT Authentication Middleware ───────────────────────────────────
io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication error: No token provided'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.data.user = decoded;
        next();
    } catch (err) {
        return next(new Error('Authentication error: Invalid or expired token'));
    }
});

// ── Post routes — pass io so the route can emit Socket.io events ──────────────
app.use('/api/posts', postRoutes(io));

import errorHandler from './middleware/errorHandler.js';

// ── Socket.io connection handling ─────────────────────────────────────────────
io.on('connection', (socket) => {
    console.log(`✅ User connected: ${socket.id} | User: ${socket.data.user.email}`);

    socket.on('disconnect', (reason) => {
        console.log(`❌ User disconnected: ${socket.id} (${reason})`);
    });
});

app.use((req, res, next) => {
    const err = new Error(`Route not found: ${req.originalUrl}`);
    err.status = 404;
    next(err);
});
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
httpServer.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔌 Socket.io ready for connections`);
});
