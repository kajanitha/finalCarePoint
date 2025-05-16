import { Link, usePage } from '@inertiajs/react';
import { Icon } from 'components/ui/icon';
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from 'components/ui/sidebar';
import { FileText, Stethoscope } from 'lucide-react';
import { type NavItem } from 'types';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    console.log('NavMain render, current page.url:', page.url);
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton asChild isActive={item.href === page.url} tooltip={{ children: item.title }}>
                            <Link href={item.href} prefetch onClick={() => console.log('NavMain Link clicked:', item.href)}>
                                {item.icon && <item.icon />}
                                <span>{item.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
                <SidebarMenuItem key="Doctor Appointments">
                    <SidebarMenuButton asChild isActive={page.url === '/doctor/appointments'} tooltip={{ children: 'Doctor Appointments' }}>
                        <Link href="/doctor/appointments" prefetch>
                            <Icon iconNode={Stethoscope} className="mr-2 inline-block h-4 w-4" />
                            <span>Doctor Appointments</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem key="Prescriptions">
                    <SidebarMenuButton asChild isActive={page.url === '/doctor/prescriptions'} tooltip={{ children: 'Prescriptions' }}>
                        <Link href="/doctor/prescriptions" prefetch>
                            <Icon iconNode={FileText} className="mr-2 inline-block h-4 w-4" />
                            <span>Prescriptions</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarGroup>
    );
}
