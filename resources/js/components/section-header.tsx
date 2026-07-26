import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

interface SectionHeaderProps {
    title: string;
    href?: string;
}

export function SectionHeader({ title, href }: SectionHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{title}</h2>
            {href && (
                <Link
                    href={href}
                    className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                    عرض الكل
                    <ChevronRight className="h-3.5 w-3.5" />
                </Link>
            )}
        </div>
    );
}
