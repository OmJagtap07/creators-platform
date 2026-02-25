import { Link } from 'react-router-dom';
import './Auth.css';

function Register() {
    return (
        <main className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <span className="auth-icon">🚀</span>
                    <h1>Join CreatorHub</h1>
                    <p>Create your free account and start writing today</p>
                </div>

                <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            placeholder="Your full name"
                            autoComplete="name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            autoComplete="email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Create a strong password"
                            autoComplete="new-password"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input
                            id="confirm-password"
                            type="password"
                            placeholder="Repeat your password"
                            autoComplete="new-password"
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full">
                        Create Account
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
