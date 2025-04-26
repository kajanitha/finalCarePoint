import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from './ui/button';

const Header: React.FC = () => {
  const { auth } = usePage().props as any;

    return (
        <header className="bg-gray-200 text-white p-4 flex justify-between items-center">
            <Link href="/" className="flex items-center gap-2">
                <img src="/images/logo.png" alt="CarePoint Logo" className="h-20 w-auto" />
                <span className="text-xl font-bold text-blue-500">CarePoint</span>

            </Link>
            <nav>
                {!auth || !auth.user ? (
                    <>
                        <Link href="/login" className="mr-4">
                            <Button variant="outline" size="sm">Login</Button>
                        </Link>
                        <Link href="/register">
                            <Button variant="default" size="sm">Register</Button>
                        </Link>
                    </>
                ) : (
                    <Link href="/dashboard">
                        <Button variant="default" size="sm">Dashboard</Button>
                    </Link>
                )}
            </nav>
        </header>
    );
};

export default Header;
