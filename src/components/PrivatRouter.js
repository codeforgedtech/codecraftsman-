import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth'; // Anta att du har en useAuth-hook för att få autentiseringstillståndet

const PrivateRoute = ({ element, ...rest }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Eller en spinner
  }

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;