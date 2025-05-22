import '../css/app.css';

import { router } from '@inertiajs/core';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import PrivateRoute from './components/PrivateRoute';
import { initializeTheme } from './hooks/use-appearance';
import axiosInstance from './lib/axiosInstance';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

// Define interface for window.Laravel
interface LaravelWindow extends Window {
    Laravel?: {
        csrfToken?: string;
    };
}

const csrfToken = document.head.querySelector('meta[name="csrf-token"]');
if (!csrfToken) {
    const meta = document.createElement('meta');
    meta.name = 'csrf-token';
    const win = window as LaravelWindow;
    meta.content = win.Laravel?.csrfToken || '';
    document.head.appendChild(meta);
}

// Add global Inertia setup to include CSRF token in headers and send credentials
router.on('before', (event: Event) => {
    const token = document.head.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (token && (event as CustomEvent).detail) {
        const detail = (event as CustomEvent).detail;
        if (detail.visit && detail.visit.options) {
            detail.visit.options.headers = {
                ...(detail.visit.options.headers || {}),
                'X-CSRF-TOKEN': token,
            };
            detail.visit.options.withCredentials = true;
        }
    }
});

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        // Wrap pages with PrivateRoute if needed
        const page = resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')) as Promise<{
            default: React.ComponentType<Record<string, unknown>>;
        }>;
        if (['PatientDashboard', 'ClinicList', 'ClinicDetails', 'AppointmentForm', 'UserProfile'].includes(name)) {
            return page.then((mod) => {
                const PageComponent = mod.default;
                const WrappedComponent: React.ComponentType<Record<string, unknown>> = (props) => (
                    <PrivateRoute>
                        <PageComponent {...props} />
                    </PrivateRoute>
                );
                return { ...mod, default: WrappedComponent };
            });
        }
        return page;
    },
    setup: ({ el, App, props }) => {
        // Request CSRF cookie before rendering the app
        axiosInstance.get('/sanctum/csrf-cookie').then(() => {
            const root = createRoot(el);
            root.render(<App {...props} />);
        });
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
