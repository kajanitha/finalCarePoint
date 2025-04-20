import '../css/app.css';

import React from 'react';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';
import PrivateRoute from './components/PrivateRoute';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        // Wrap pages with PrivateRoute if needed
        const page = resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx'));
        if ([
            'PatientDashboard',
            'ClinicDashboard',
            'ClinicList',
            'ClinicDetails',
            'AppointmentForm',
            'UserProfile',
        ].includes(name)) {
            return page.then((mod: any) => {
                const PageComponent = mod.default;
                mod.default = (props: any) => (
                    <PrivateRoute>
                        <PageComponent {...props} />
                    </PrivateRoute>
                );
                return mod;
            });
        }
        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
