import AppLogoIcon from '@/components/app-logo-icon';
import { Link } from '@inertiajs/react';
import { type PropsWithChildren } from 'react';

interface AuthLayoutProps {
    name?: string;
    title?: string;
    description?: string;
}

export default function AuthSimpleLayout({ children, title, description }: PropsWithChildren<AuthLayoutProps>) {
    return (
        <div className="bg-gradient-to-r from-blue-500 to-[#1e3a8a] flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">

                        <div className="space-y-2 text-center">
                            <h1 className="text-xl font-medium">{title}</h1>
                            <p className="text-muted-foreground text-center text-sm">{description}</p>
                        </div>
                    </div>
                    <div className="bg-[#f8f0fb] text-black rounded-md p-6">
                    <Link href={route('home')} className="flex flex-col items-center gap-2 font-medium">
                        <div className="mb-1 flex h-30 w-50 items-center justify-center rounded-md">
                            <img src="/images/logo.png" alt="Logo" className="h-50 w-50 object-contain" />
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
