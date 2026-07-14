import { Link } from '@inertiajs/react';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ComponentType } from 'react';

export interface RowActionItem {
    label: string;
    icon?: ComponentType<{ className?: string }>;
    href?: string;
    onClick?: () => void;
    variant?: 'default' | 'destructive';
}

export type RowActionEntry = RowActionItem | { separator: true };

interface RowActionsProps {
    items: RowActionEntry[];
}

export default function RowActions({ items }: RowActionsProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">الإجراءات</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
                {items.map((entry, i) => {
                    if ('separator' in entry) {
                        return <DropdownMenuSeparator key={`sep${i}`} />;
                    }

                    const { label, icon: Icon, href, onClick, variant = 'default' } = entry;

                    if (href) {
                        return (
                            <DropdownMenuItem key={i} asChild variant={variant}>
                                <Link href={href}>
                                    {Icon && <Icon className="h-4 w-4" />}
                                    {label}
                                </Link>
                            </DropdownMenuItem>
                        );
                    }

                    return (
                        <DropdownMenuItem
                            key={i}
                            variant={variant}
                            onClick={onClick}
                        >
                            {Icon && <Icon className="h-4 w-4" />}
                            {label}
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}