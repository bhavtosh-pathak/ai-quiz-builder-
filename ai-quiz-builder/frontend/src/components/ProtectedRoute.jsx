import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

/**
 * Guards a route behind authentication and, optionally, a specific role.
 * Usage: <ProtectedRoute roles={['teacher']}><TeacherDashboard /></ProtectedRoute>
 */
const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader fullScreen label="Checking your session..." />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;
