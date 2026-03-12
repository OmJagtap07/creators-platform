import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import toast2 from 'react-hot-toast';
import api from '../services/api';
import socket from '../services/socket';
import './Dashboard.css';

const CATEGORY_COLORS = {
    Technology: '#3b82f6',
    Lifestyle: '#a855f7',
    Travel: '#10b981',
    Food: '#f59e0b',
};

function Dashboard() {
    const { user, logout } = useAuth();

    // ── Posts state ─────────────────────────────────────────────
    const [posts, setPosts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null); // tracks which post is being deleted

    const navigate = useNavigate();

    // ── Fetch paginated posts ────────────────────────────────────
    const fetchPosts = useCallback(async (page) => {
        setIsLoading(true);
        try {
            const res = await api.get(`/api/posts?page=${page}&limit=5`);
            setPosts(res.data.data);
            setPagination(res.data.pagination);
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to load posts. Please try again.';
            toast.error(msg);
            console.error('Fetch posts error:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (user) fetchPosts(currentPage);
    }, [user, currentPage, fetchPosts]);

    // ── Socket.io lifecycle ──────────────────────────────────────
    useEffect(() => {
        // Connect when the authenticated Dashboard mounts
        socket.connect();

        // Built-in event: connection established
        socket.on('connect', () => {
            console.log('🔌 Socket connected:', socket.id);
        });

        // Built-in event: connection lost
        socket.on('disconnect', (reason) => {
            console.log('❌ Socket disconnected:', reason);
        });

        // Built-in event: failed to connect
        socket.on('connect_error', (error) => {
            console.error('Socket auth error:', error.message);
        });

        // Real-time: listen for new posts created by any user
        socket.on('newPost', (data) => {
            toast2.success(data.message, {
                icon: '🔔',
                style: {
                    background: '#1e293b',
                    color: '#f1f5f9',
                    border: '1px solid #334155',
                },
            });
        });

        // Cleanup: remove listeners & disconnect when component unmounts
        // This prevents memory leaks and duplicate connections on re-render
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('connect_error');
            socket.off('newPost'); // Prevent duplicate listeners on re-mount
            socket.disconnect();
        };
    }, []); // Empty array → runs once on mount, cleans up on unmount

    const handlePageChange = (newPage) => setCurrentPage(newPage);

    // ── Delete handler ───────────────────────────────────────────
    const handleDelete = async (postId) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this post? This action cannot be undone.'
        );
        if (!confirmed) return;

        setDeletingId(postId);
        try {
            const res = await api.delete(`/api/posts/${postId}`);
            if (res.data.success) {
                // Optimistic update — remove from UI immediately
                setPosts((prev) => prev.filter((p) => p._id !== postId));
                setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
                toast.success('Post deleted successfully!');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to delete post. Please try again.';
            toast.error(msg);
            console.error('Delete error:', err);
        } finally {
            setDeletingId(null);
        }
    };

    // ── Derived stats from real data ─────────────────────────────
    const publishedCount = posts.filter((p) => p.status === 'published').length;
    const draftCount = posts.filter((p) => p.status === 'draft').length;

    return (
        <main className="dashboard">
            <div className="dashboard-inner">

                {/* ── Welcome Header ─────────────────────────────── */}
                <div className="dashboard-header">
                    <div>
                        <h1>Welcome back, {user?.name} 👋</h1>
                        <p className="dashboard-subtitle">Manage and create your blog posts</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link to="/create" id="new-post-btn" className="btn btn-primary">
                            + New Post
                        </Link>
                        <button
                            onClick={logout}
                            className="btn btn-logout"
                            style={{
                                padding: '0.55rem 1.2rem',
                                backgroundColor: 'transparent',
                                border: '1px solid #475569',
                                borderRadius: '8px',
                                color: '#94a3b8',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                transition: 'border-color 0.2s, color 0.2s',
                            }}
                            onMouseOver={e => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171'; }}
                            onMouseOut={e => { e.currentTarget.style.borderColor = '#475569'; e.currentTarget.style.color = '#94a3b8'; }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* ── User Info Card ──────────────────────────────── */}
                <div style={{
                    background: '#1e293b', border: '1px solid #334155',
                    borderRadius: '12px', padding: '1.5rem 2rem',
                    marginBottom: '2rem', display: 'flex', gap: '2.5rem', flexWrap: 'wrap',
                }}>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</span>
                        <p style={{ color: '#f1f5f9', fontWeight: '600', marginTop: '0.2rem' }}>{user?.name}</p>
                    </div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Email</span>
                        <p style={{ color: '#f1f5f9', fontWeight: '600', marginTop: '0.2rem' }}>{user?.email}</p>
                    </div>
                    <div>
                        <span style={{ color: '#64748b', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Member Since</span>
                        <p style={{ color: '#f1f5f9', fontWeight: '600', marginTop: '0.2rem' }}>
                            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}
                        </p>
                    </div>
                </div>

                {/* ── Stats ───────────────────────────────────────── */}
                <div className="stats-grid">
                    {[
                        { label: 'Total Posts', value: pagination.total ?? '—', icon: '📝' },
                        { label: 'Total Pages', value: pagination.totalPages ?? '—', icon: '📄' },
                        { label: 'Published', value: publishedCount, icon: '🚀' },
                        { label: 'Drafts', value: draftCount, icon: '📂' },
                    ].map((stat) => (
                        <div key={stat.label} className="stat-card">
                            <span className="stat-icon">{stat.icon}</span>
                            <span className="stat-value">{stat.value}</span>
                            <span className="stat-label">{stat.label}</span>
                        </div>
                    ))}
                </div>

                {/* ── Posts Section ───────────────────────────────── */}
                <div className="recent-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h2 className="section-heading" style={{ margin: 0 }}>Your Posts</h2>
                        {pagination.total > 0 && (
                            <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                                {pagination.total} post{pagination.total !== 1 ? 's' : ''} total
                            </span>
                        )}
                    </div>

                    {/* Loading State */}
                    {isLoading ? (
                        <div style={{ textAlign: 'center', padding: '3rem', color: '#475569' }}>
                            <div style={{
                                display: 'inline-block', width: '32px', height: '32px',
                                border: '3px solid #334155', borderTopColor: '#3b82f6',
                                borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                                marginBottom: '0.75rem',
                            }} />
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>Loading posts…</p>
                        </div>
                    ) : posts.length === 0 ? (
                        /* Empty State */
                        <div style={{
                            textAlign: 'center', padding: '3.5rem 2rem',
                            background: '#1e293b', borderRadius: '12px',
                            border: '1px dashed #334155',
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✍️</div>
                            <h3 style={{ color: '#f1f5f9', fontWeight: '600', margin: '0 0 0.5rem' }}>No posts yet</h3>
                            <p style={{ color: '#64748b', fontSize: '0.9rem', margin: '0 0 1.5rem' }}>
                                Start writing and share your ideas with the world.
                            </p>
                            <Link to="/create" className="btn btn-primary">+ Create Your First Post</Link>
                        </div>
                    ) : (
                        <>
                            {/* Posts Cards */}
                            <div className="posts-cards">
                                {posts.map((post) => (
                                    <div key={post._id} className="post-card">
                                        <div className="post-card-header">
                                            <h3 className="post-card-title">{post.title}</h3>
                                            <span className={`status-badge ${post.status}`}>{post.status}</span>
                                        </div>

                                        <p className="post-card-preview">
                                            {post.content.length > 160
                                                ? post.content.slice(0, 160) + '…'
                                                : post.content}
                                        </p>

                                        <div className="post-card-meta">
                                            <span
                                                className="category-tag"
                                                style={{
                                                    color: CATEGORY_COLORS[post.category] || '#64748b',
                                                    borderColor: CATEGORY_COLORS[post.category] || '#64748b',
                                                }}
                                            >
                                                {post.category}
                                            </span>
                                            <span className="post-date">
                                                {new Date(post.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'short', day: 'numeric',
                                                })}
                                            </span>
                                        </div>

                                        {/* ── Action Buttons ── */}
                                        <div className="post-card-actions">
                                            <Link
                                                to={`/edit/${post._id}`}
                                                className="btn-card-edit"
                                                id={`edit-btn-${post._id}`}
                                            >
                                                ✏️ Edit
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(post._id)}
                                                className="btn-card-delete"
                                                id={`delete-btn-${post._id}`}
                                                disabled={deletingId === post._id}
                                            >
                                                {deletingId === post._id ? 'Deleting…' : '🗑️ Delete'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination Controls */}
                            {pagination.totalPages > 1 && (
                                <div className="pagination">
                                    <button
                                        id="prev-page-btn"
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={!pagination.hasPrevPage}
                                    >
                                        ← Previous
                                    </button>

                                    <span className="pagination-info">
                                        Page <strong>{pagination.page}</strong> of <strong>{pagination.totalPages}</strong>
                                        &nbsp;&middot;&nbsp;{pagination.total} posts
                                    </span>

                                    <button
                                        id="next-page-btn"
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={!pagination.hasNextPage}
                                    >
                                        Next →
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>

            </div>
        </main>
    );
}

export default Dashboard;
