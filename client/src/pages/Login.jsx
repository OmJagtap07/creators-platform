import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Login() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [apiError, setApiError] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    // ── Handlers ─────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        if (apiError) setApiError('');
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        if (!validateForm()) return;

        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email.trim().toLowerCase(),
                    password: formData.password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Store JWT via AuthContext (handles state + localStorage)
                login(data.user, data.token);
                setFormData({ email: '', password: '' });
                navigate('/dashboard');
            } else {
                setApiError(data.message || 'Login failed. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            setApiError('Unable to connect to server. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // ── UI ────────────────────────────────────────────────────
    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-icon">🔑</span>
                    <h1>Welcome Back</h1>
                    <p>Sign in to your CreatorHub account</p>
                </div>

                {/* API error banner */}
                {apiError && (
                    <div className="auth-alert auth-alert--error" role="alert">
                        {apiError}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSubmit} noValidate>

                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            autoComplete="email"
                            disabled={isLoading}
                            className={errors.email ? 'input-error' : ''}
                        />
                        {errors.email && <span className="field-error">{errors.email}</span>}
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={isLoading}
                            className={errors.password ? 'input-error' : ''}
                        />
                        {errors.password && <span className="field-error">{errors.password}</span>}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className={`btn btn-primary btn-full${isLoading ? ' btn-loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner" aria-hidden="true" />
                                Signing in…
                            </>
                        ) : 'Sign In'}
                    </button>
                </form>

                <p className="auth-footer">
                    Don&apos;t have an account?{' '}
                    <Link to="/register">Create one free</Link>
                </p>
            </div>
        </main>
    );
}

export default Login;
