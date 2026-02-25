import { Link, NavLink } from 'react-router-dom';
import './Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header-container">
                <Link to="/" className="header-logo">
                    <span className="logo-icon">✍️</span>
                    <span className="logo-text">CreatorHub</span>
                </Link>

                <nav className="header-nav">
                    <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                        end
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/login"
                        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                    >
                        Login
                    </NavLink>
                    <NavLink
                        to="/register"
                        className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                    >
                        <span className="nav-link-register">Register</span>
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}

export default Header;
