import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ProfileSectionProps {
    icon?: ReactNode;
    title: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
}

export function ProfileSection({
    icon,
    title,
    action,
    children,
    className,
}: ProfileSectionProps) {
    return (
        <section
            className={cn(
                'rounded-2xl border bg-card p-5 shadow-xs sm:p-6',
                className,
            )}
        >
            <div className="mb-4 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                    {icon && (
                        <span className="text-muted-foreground">{icon}</span>
                    )}
                    <h3 className="font-heading text-[15px] font-bold tracking-tight text-foreground">
                        {title}
                    </h3>
                </div>
                {action}
            </div>
            {children}
        </section>
    );
}
