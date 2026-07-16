import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';

interface EmptyStateProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
}

export function EmptyState({ icon: Icon, title, description, actionLabel, actionHref }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-12 text-center">
            <Icon className="h-10 w-10 text-muted-foreground/30" />
            <p className="text-muted-foreground">{title}</p>
            <p className="text-sm text-muted-foreground/60 max-w-xs">{description}</p>
            {actionLabel && actionHref && (
                <Link href={actionHref}>
                    <Button variant="outline" size="sm" className="mt-2 gap-1.5">
                        {actionLabel}
                        <ChevronRight className="h-3.5 w-3.5" />
                    </Button>
                </Link>
            )}
        </div>
    );
}
