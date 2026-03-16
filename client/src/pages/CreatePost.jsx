import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';
import ImageUpload from '../components/ImageUpload';
import './CreatePost.css';

const CATEGORIES = ['Technology', 'Lifestyle', 'Travel', 'Food'];

const CreatePost = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category: 'Technology',
        status: 'draft',
    });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Called by ImageUpload when the user clicks "Upload Image".
    // formData has the file under key 'image'.
    // In Lesson 4.7 this will send formData to /api/upload and store the returned URL.
    const handleUpload = (formData) => {
        console.log('FormData ready — file object:', formData.get('image'));
    };

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.content.length < 10) {
            toast.error('Content must be at least 10 characters.');
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post('/api/posts', formData);
            if (response.data.success) {
                toast.success('Post created successfully!');
                navigate('/dashboard');
            }
        } catch (err) {
            const msg = err.response?.data?.message || 'Failed to create post. Please try again.';
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const charCount = formData.content.length;

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
                        <div className="create-header-icon">✍️</div>
                        <h1 className="create-title">New Post</h1>
                        <p className="create-subtitle">Share your ideas with the world</p>
                    </div>

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
                                placeholder="Write your post content here… (minimum 10 characters)"
                                rows={12}
                                required
                                className="form-textarea"
                            />
                            <span className={`char-hint ${charCount < 10 && charCount > 0 ? 'char-hint--warn' : ''}`}>
                                {charCount} characters {charCount < 10 ? `(${10 - charCount} more needed)` : '✓'}
                            </span>
                        </div>

                        {/* Cover Image Upload */}
                        <div className="form-group">
                            <ImageUpload onUpload={handleUpload} />
                        </div>

                        {/* Actions */}
                        <div className="form-actions">
                            <Link to="/dashboard" className="btn-cancel">
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="btn-submit"
                                id="create-post-btn"
                            >
                                {isLoading ? (
                                    <span className="btn-loading">
                                        <span className="spinner" /> Creating…
                                    </span>
                                ) : (
                                    <>
                                        {formData.status === 'published' ? '🚀 Publish Post' : '💾 Save Draft'}
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </main>
    );
};

export default CreatePost;
