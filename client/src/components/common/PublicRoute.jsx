import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const PublicRoute = ({ children }) => {
    const { user, loading } = useAuth();

    // Wait for auth check to complete before deciding
    if (loading) {
        return <LoadingSpinner />;
    }

    // If user is already logged in, redirect them to dashboard
    if (user) {
        return <Navigate to="/dashboard" replace />;
    }

    // User is NOT logged in — show the public page (login/register)
    return children;
};

export default PublicRoute;
