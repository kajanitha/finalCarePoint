import { usePage } from '@inertiajs/react';
import React from 'react';

interface PrivateRouteProps {
    children: React.ReactNode;
}

interface Auth {
    user?: {
        id: number;
        name: string;
        email: string;
        // Add other user properties as needed
    } | null;
}

interface PageProps {
    auth?: Auth;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
    const { auth } = usePage().props as PageProps;

    if (!auth || !auth.user) {
        // User is not authenticated, redirect to login
        window.location.href = '/login';
        return null;
    }

    return <>{children}</>;
};

export default PrivateRoute;
