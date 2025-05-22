import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { Button } from './ui/button';

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

const Header: React.FC = () => {
    const { auth } = usePage().props as PageProps;

    return (
        <header className="flex items-center justify-between bg-gray-200 p-4 text-white">
            <Link href="/" className="flex items-center gap-2">
                <img src="/images/logo.png" alt="CarePoint Logo" className="h-20 w-auto" />
                <span className="text-xl font-bold text-blue-500">CarePoint</span>
            </Link>
            <nav>
                {!auth || !auth.user ? (
                    <>
                        <Link href="/login" className="mr-4">
                            <Button variant="outline" size="sm" className="transition-transform duration-300 ease-in-out hover:scale-105">
                                Login
                            </Button>
                        </Link>
                        <Link href="/register">
                            <Button
                                variant="default"
                                size="sm"
                                className="transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-700"
                            >
                                Register
                            </Button>
                        </Link>
                    </>
                ) : (
                    <Link href="/dashboard">
                        <Button
                            variant="default"
                            size="sm"
                            className="transition-transform duration-300 ease-in-out hover:scale-105 hover:bg-blue-700"
                        >
                            Dashboard
                        </Button>
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
