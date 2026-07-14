import { Link } from '@inertiajs/react';
import { ChevronLeft, House } from 'lucide-react';
import competitions from '@/routes/student/competitions';
import type { Competition } from '@/types/competition';

export default function BreadcrumbTrail({
    parent,
    currentName,
    classification,
}: {
    parent: Competition | null;
    currentName: string;
    classification?: string;
}) {
    return (
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link
                href={competitions.index().url}
                className="inline-flex items-center gap-1 hover:text-foreground transition-colors"
            >
                <House className="h-3.5 w-3.5" />
                <span>الرئيسية</span>
            </Link>

            {parent && (
                <>
                    <ChevronLeft className="h-3.5 w-3.5" />

                    <Link
                        href={competitions.show({ competition: parent.id }).url}
                        className="hover:text-foreground transition-colors"
                    >
                        {parent.name}
                    </Link>
                </>
            )}

            <ChevronLeft className="h-3.5 w-3.5" />

            <span className="font-medium text-foreground">{currentName}</span>

            {classification && (
                <span className="rounded border border-border/30 px-2 py-0.5 text-[10px] text-muted-foreground/60">
                    {classification === 'container' && 'حاوية'}
                    {classification === 'standalone' && 'مستقلة'}
                    {classification === 'child' && 'ابن'}
                </span>
            )}
        </nav>
    );
}
