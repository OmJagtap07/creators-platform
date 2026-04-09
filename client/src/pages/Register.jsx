import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import './Auth.css';

function Register() {
    // Form field state (single object for all fields)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    // UI state
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [apiError, setApiError] = useState('');

    // Password visibility toggles
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    // ── Input change handler ───────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear validation error as soon as user starts correcting the field
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    // ── Client-side validation ─────────────────────────────────────────────────
    const validateForm = () => {
        const newErrors = {};

        // Name
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        } else if (formData.name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        } else if (formData.name.trim().length > 50) {
            newErrors.name = 'Name cannot exceed 50 characters';
        }

        // Email
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Password
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        // Confirm password
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // ── Password strength helper ───────────────────────────────────────────────
    const getPasswordStrength = (pwd) => {
        if (!pwd) return null;
        if (pwd.length < 6) return 'weak';
        if (
            pwd.length >= 10 &&
            /[a-z]/.test(pwd) &&
            /[A-Z]/.test(pwd) &&
            /[0-9]/.test(pwd)
        ) {
            return 'strong';
        }
        return 'medium';
    };

    const strength = getPasswordStrength(formData.password);

    // ── Form submission ────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Reset previous API messages
        setSuccessMessage('');
        setApiError('');

        // Bail out if client-side validation fails
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const registrationData = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            };

            // api.post sets Content-Type: application/json automatically
            const response = await api.post('/api/users/register', registrationData);

            // Axios puts response body in response.data
            console.log('Registration successful:', response.data);

            setSuccessMessage('🎉 Account created successfully! Redirecting to login…');
            // Clear the form
            setFormData({ name: '', email: '', password: '', confirmPassword: '' });
            // Redirect after 2s
            setTimeout(() => navigate('/login'), 2000);
        } catch (err) {
            // Axios throws on non-2xx; error.response contains server data
            const message = err.response?.data?.message || 'Registration failed. Please try again.';
            setApiError(message);
        } finally {
            setIsLoading(false);
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <main className="auth-page">
            <div className="auth-card">
                {/* Header */}
                <div className="auth-header">
                    <span className="auth-icon">🚀</span>
                    <h1>Join CreatorHub</h1>
                    <p>Create your free account and start creating today</p>
                </div>

                {/* Success banner */}
                {successMessage && (
                    <div className="auth-alert auth-alert--success" role="alert">
                        {successMessage}
                    </div>
                )}

                {/* API error banner */}
                {apiError && (
                    <div className="auth-alert auth-alert--error" role="alert">
                        {apiError}
                    </div>
                )}

                {/* Form */}
                <form className="auth-form" onSubmit={handleSubmit} noValidate>

                    {/* Name */}
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your full name"
                            autoComplete="name"
                            className={errors.name ? 'input-error' : ''}
                            disabled={isLoading}
                        />
                        {errors.name && (
                            <span className="field-error">{errors.name}</span>
                        )}
                    </div>

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
                            className={errors.email ? 'input-error' : ''}
                            disabled={isLoading}
                        />
                        {errors.email && (
                            <span className="field-error">{errors.email}</span>
                        )}
                    </div>

                    {/* Password */}
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Min 6 characters"
                                autoComplete="new-password"
                                className={errors.password ? 'input-error' : ''}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="toggle-visibility"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {/* Password strength bar */}
                        {formData.password && (
                            <div
                                className={`strength-bar strength-bar--${strength}`}
                                title={`Password strength: ${strength}`}
                            />
                        )}
                        {errors.password && (
                            <span className="field-error">{errors.password}</span>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-wrapper">
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repeat your password"
                                autoComplete="new-password"
                                className={errors.confirmPassword ? 'input-error' : ''}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                className="toggle-visibility"
                                onClick={() => setShowConfirmPassword((v) => !v)}
                                aria-label="Toggle confirm password visibility"
                            >
                                {showConfirmPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <span className="field-error">{errors.confirmPassword}</span>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className={`btn btn-primary btn-full${isLoading ? ' btn-loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner" /> Creating Account…
                            </>
                        ) : (
                            'Create Account'
                        )}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/login">Sign in here</Link>
                </p>
            </div>
        </main>
    );
}

export default Register;
