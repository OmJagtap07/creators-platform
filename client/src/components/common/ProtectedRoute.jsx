import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const location = useLocation();

    // Show loading spinner while auth state is being restored from localStorage
    if (loading) {
        return <LoadingSpinner message="Checking authentication..." />;
    }

    // If not authenticated, redirect to login and remember where user wanted to go
    if (!user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // User is authenticated — render the protected page
    return children;
};

export default ProtectedRoute;
