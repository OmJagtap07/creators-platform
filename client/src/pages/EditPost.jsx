import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import './CreatePost.css'; // Re-use existing form styles

const CATEGORIES = ['Technology', 'Lifestyle', 'Travel', 'Food'];

const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Technology',
        status: 'draft',
    });
    const [isLoading, setIsLoading] = useState(true);  // fetching post
    const [isSaving, setIsSaving] = useState(false);   // submitting update
    const [error, setError] = useState('');
    const [fetchError, setFetchError] = useState('');

    // ── Fetch existing post data on mount ────────────────────────
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await api.get(`/api/posts/${id}`);
                const post = res.data.data;
                setFormData({
                    title: post.title,
                    content: post.content,
                    category: post.category,
                    status: post.status,
                });
            } catch (err) {
                console.error('Fetch post error:', err);
                setFetchError(err.response?.data?.message || 'Failed to load post.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.content.length < 10) {
            setError('Content must be at least 10 characters.');
            return;
        }

        setIsSaving(true);
        try {
            const res = await api.put(`/api/posts/${id}`, formData);
            if (res.data.success) {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update post. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const charCount = formData.content.length;

    // ── Loading state ────────────────────────────────────────────
    if (isLoading) {
        return (
            <main className="create-page">
                <div className="create-inner" style={{ textAlign: 'center', paddingTop: '4rem', color: '#475569' }}>
                    <div style={{
                        display: 'inline-block', width: '32px', height: '32px',
                        border: '3px solid #334155', borderTopColor: '#3b82f6',
                        borderRadius: '50%', animation: 'spin 0.8s linear infinite',
                        marginBottom: '0.75rem',
                    }} />
                    <p style={{ margin: 0 }}>Loading post…</p>
                </div>
            </main>
        );
    }

    // ── Fetch error (e.g. 403 / 404) ────────────────────────────
    if (fetchError) {
        return (
            <main className="create-page">
                <div className="create-inner" style={{ textAlign: 'center', paddingTop: '4rem' }}>
                    <div style={{
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                        color: '#fca5a5', borderRadius: '12px', padding: '2rem',
                    }}>
                        <p style={{ margin: '0 0 1rem', fontSize: '1rem' }}>⚠️ {fetchError}</p>
                        <Link to="/dashboard" className="btn-cancel">← Back to Dashboard</Link>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="create-page">
            <div className="create-inner">
                {/* Back link */}
                <Link to="/dashboard" className="back-link">
                    ← Back to Dashboard
                </Link>

                <div className="create-card">
                    {/* Header */}
                    <div className="create-header">
                        <div className="create-header-icon">✏️</div>
                        <h1 className="create-title">Edit Post</h1>
                        <p className="create-subtitle">Update your post details below</p>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div className="create-error" role="alert">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="create-form">
                        {/* Title */}
                        <div className="form-group">
                            <label htmlFor="title" className="form-label">
                                Title <span className="required">*</span>
                            </label>
                            <input
                                id="title"
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Give your post a compelling title…"
                                required
                                maxLength={100}
                                className="form-input"
                                autoFocus
                            />
                            <span className="char-hint">{formData.title.length}/100</span>
                        </div>

                        {/* Category + Status row */}
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="category" className="form-label">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="form-input"
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="status" className="form-label">Status</label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="form-input"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="form-group">
                            <label htmlFor="content" className="form-label">
                                Content <span className="required">*</span>
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Write your post content here…"
                                rows={12}
                                required
                                className="form-textarea"
                            />
                            <span className={`char-hint ${charCount < 10 && charCount > 0 ? 'char-hint--warn' : ''}`}>
                                {charCount} characters {charCount < 10 ? `(${10 - charCount} more needed)` : '✓'}
                            </span>
                        </div>

                        {/* Actions */}
                        <div className="form-actions">
                            <Link to="/dashboard" className="btn-cancel">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="btn-submit"
                                id="update-post-btn"
                            >
                                {isSaving ? (
                                    <span className="btn-loading">
                                        <span className="spinner" /> Saving…
                                    </span>
                                ) : (
                                    formData.status === 'published' ? '🚀 Update & Publish' : '💾 Save Changes'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default EditPost;
