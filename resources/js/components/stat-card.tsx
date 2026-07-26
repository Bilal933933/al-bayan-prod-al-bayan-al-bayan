import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: string | number;
    iconColor: string;
    bgColor: string;
    borderColor?: string;
}

export function StatCard({
    icon: Icon,
    label,
    value,
    iconColor,
    bgColor,
    borderColor,
}: StatCardProps) {
    const isNumeric = typeof value === 'number';

    return (
        <Card
            className={cn(
                'relative overflow-hidden border-2',
                bgColor,
                borderColor,
            )}
        >
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            {label}
                        </p>
                        <p className="mt-1 text-2xl font-bold tracking-tight">
                            {isNumeric ? (
                                <SlidingNumber number={value} inView />
                            ) : (
                                value
                            )}
                        </p>
                    </div>
                    <div
                        className={cn(
                            'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                            iconColor,
                            'bg-white/50 dark:bg-black/20',
                        )}
                    >
                        <Icon className="h-6 w-6" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
