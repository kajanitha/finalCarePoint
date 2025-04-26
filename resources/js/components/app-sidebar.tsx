import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'Patient Profile',
        href: '/user-profile',
        icon: Folder, // You can replace with a more appropriate icon
    },
    {
        title: 'Appointments',
        href: '/appointment-form',
        icon: BookOpen, // You can replace with a more appropriate icon
    },

    {
        title: 'Nearby Clinics',
        href: '/Nearby Clinics',
        icon: BookOpen, // You can replace with a more appropriate icon
    },
    {
        title: 'Account Settings',
        href: '/settings/profile',
        icon: BookOpen, // You can replace with a more appropriate icon
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset" className="bg-gray-100 text-black-600">
            <SidebarHeader className="bg-gray-100">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <Link href="/" className="flex items-center gap-2">
                                   <img src="/images/logo.png" alt="CarePoint Logo" className="h-14 w-auto" />
                                    <span className="text-xl font-bold text-blue-500">CarePoint</span>
                               
                               </Link>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="bg-blue-500">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="bg-blue-500">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
