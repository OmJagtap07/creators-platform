import axios from 'axios';

// ── Axios instance ─────────────────────────────────────────────
// NOTE: Do NOT set a global Content-Type here.
// For JSON requests axios picks the right header automatically.
// For FormData (file uploads) the browser must set Content-Type
// to multipart/form-data WITH the boundary string — a hardcoded
// JSON header would override that and break every upload.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    timeout: 30000, // 30-second timeout (images can be slow on first upload)
});

// ── Request interceptor: attach JWT to every outgoing request ──
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 Unauthorized globally ────
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token is invalid or expired — clear session and redirect
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            console.warn('Session expired. Redirecting to login…');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
