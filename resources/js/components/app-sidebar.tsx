import { Link } from '@inertiajs/react';
import {
    BookOpen,
    GraduationCap,
    History,
    LayoutGrid,
    LogOut,
    Settings,
    Trophy,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import adminAttempts from '@/routes/admin/attempts';
import adminCompetitions from '@/routes/admin/competitions';
import adminQuestions from '@/routes/admin/questions';
import adminTopics from '@/routes/admin/topics';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'لوحة التحكم',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'المسابقات',
        href: adminCompetitions.index(),
        icon: Trophy,
    },
    {
        title: 'المحاور',
        href: adminTopics.index(),
        icon: BookOpen,
    },
    {
        title: 'الأسئلة',
        href: adminQuestions.index(),
        icon: GraduationCap,
    },
    {
        title: 'المحاولات',
        href: adminAttempts.index(),
        icon: History,
    },
    {
        title: 'المستخدمون',
        href: '#',
        icon: Users,
    },
    {
        title: 'الإعدادات',
        href: '#',
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'تسجيل الخروج',
        href: '#',
        icon: LogOut,
    },
];

export function AppSidebar() {
    return (
        <Sidebar side="right" collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
