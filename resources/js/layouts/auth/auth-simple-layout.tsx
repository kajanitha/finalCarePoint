import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-gradient-to-r from-blue-500 to-[#1e3a8a] p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <div className="space-y-2 text-center">
                            <h1 className="text-lg font-medium text-white">{title}</h1>
                            <p className="text-muted-foreground text-center text-sm text-white">{description}</p>
                        </div>
                    </div>
                    <div className="rounded-md bg-[#f8f0fb] p-6 text-black">
                        <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                            <div className="mb-1 flex h-30 w-30 items-center justify-center rounded-md">
                                <img src="/images/logo.png" alt="Logo" className="h-30 w-30 object-contain" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
