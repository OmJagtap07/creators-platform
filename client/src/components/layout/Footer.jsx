import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <span className="logo-icon">✍️</span>
                    <span className="logo-text">CreatorHub</span>
                    <p className="footer-tagline">Empowering creators to share their stories.</p>
                </div>

                <div className="footer-links">
                    <h4>Platform</h4>
                    <Link to="/">Home</Link>
                    <Link to="/dashboard">Dashboard</Link>
                    <Link to="/register">Get Started</Link>
                </div>

                <div className="footer-links">
                    <h4>Account</h4>
                    <Link to="/login">Login</Link>
                    <Link to="/register">Register</Link>
                </div>
            </div>

            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} CreatorHub. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
