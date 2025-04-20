import React from 'react';
import { usePage } from '@inertiajs/react';

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { auth } = usePage().props as any;

  if (!auth || !auth.user) {
    // User is not authenticated, redirect to login
    window.location.href = '/login';
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;
