import { io } from 'socket.io-client';

// Server URL — uses Vite env var with fallback for local dev
const SOCKET_URL = import.meta.env.VITE_API_URL || 'https://creator-platform-api-dgyf.onrender.com';

/**
 * Centralised Socket.io instance.
 *
 * autoConnect: false  → We control exactly WHEN the socket connects:
 *   ✅ Connect when user logs in (Dashboard mounts)
 *   ✅ Disconnect when user logs out (Dashboard unmounts)
 *   ❌ Do NOT connect while user is just browsing public pages
 *
 * auth.token → JWT sent during handshake so the server can verify
 *   the user before accepting the connection (Socket.io middleware)
 */
const socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
    auth: {
        // Read the JWT from localStorage — same key used during login
        token: localStorage.getItem('token'),
    },
});

export default socket;
