import { io } from 'socket.io-client';

// Server URL — uses Vite env var with fallback for local dev
const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Centralised Socket.io instance.
 *
 * autoConnect: false  → We control exactly WHEN the socket connects:
 *   ✅ Connect when user logs in (Dashboard mounts)
 *   ✅ Disconnect when user logs out (Dashboard unmounts)
 *   ❌ Do NOT connect while user is just browsing public pages
 */
const socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
});

export default socket;
