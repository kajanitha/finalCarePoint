import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, HouseIcon, LayoutGrid } from 'lucide-react';

import { CalendarCheck, CheckSquare, UserPlus } from 'lucide-react';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutGrid,
    },

    {
        title: 'Home',
        href: '/',
        icon: HouseIcon,
    },
    {
        title: 'Register New Patient',
        href: '/patients/register',
        icon: UserPlus,
    },
    {
        title: 'Book Appointment',
        href: '/book-appointment',
        icon: CalendarCheck,
    },
    {
        title: 'Check-in Patient',
        href: '/patients/checkin',
        icon: CheckSquare,
    },
    {
        title: 'Patients',
        href: '/patients',
        icon: UserPlus,
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
        <Sidebar collapsible="icon" variant="inset" className="text-black-600 bg-gray-100">
            <SidebarHeader className="bg-gray-100">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch className="flex items-center gap-2">
                                <img src="/images/logo.png" alt="CarePoint Logo" className="h-14 w-auto" />
                                <span className="text-xl font-bold text-blue-500">CarePoint</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-gray-100 y-auto bg-blue-500 px-2 py-4">
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter className="bg-blue-500">
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
