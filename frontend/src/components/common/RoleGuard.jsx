import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export const RoleGuard = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
