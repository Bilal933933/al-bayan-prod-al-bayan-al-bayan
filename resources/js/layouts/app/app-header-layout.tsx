import { AppContent } from '@/components/app-content';
import { AppHeader } from '@/components/app-header';
import { AppShell } from '@/components/app-shell';
import type { AppLayoutProps } from '@/types';

export default function AppHeaderLayout({
    children,
    breadcrumbs,
}: AppLayoutProps) {
    const hasBreadcrumbs = breadcrumbs && breadcrumbs.length > 1;

    return (
        <AppShell variant="header">
            <AppHeader breadcrumbs={breadcrumbs} />
            <div
                className={hasBreadcrumbs ? 'h-28 shrink-0' : 'h-16 shrink-0'}
            />
            <AppContent variant="header">{children}</AppContent>
        </AppShell>
    );
}
