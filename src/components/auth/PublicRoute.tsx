import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../../contexts/useAuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  // Show loading while authentication is being checked
  if (isLoading) {
    return <LoadingSpinner fullScreen message="Checking authentication..." />;
  }

  // If already authenticated, redirect to app
  if (isAuthenticated) {
    return <Navigate to="/app" replace />;
  }

  // If not authenticated, show the public content (auth forms)
  return <>{children}</>;
};

export default PublicRoute;
