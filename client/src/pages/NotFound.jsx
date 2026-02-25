import { Link } from 'react-router-dom';
import './NotFound.css';

function NotFound() {
    return (
        <main className="notfound-page">
            <div className="notfound-inner">
                <span className="notfound-emoji">🔍</span>
                <h1 className="notfound-code">404</h1>
                <h2 className="notfound-title">Page Not Found</h2>
                <p className="notfound-text">
                    Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link to="/" className="btn btn-primary">
                    ← Back to Home
                </Link>
            </div>
        </main>
    );
}

export default NotFound;
