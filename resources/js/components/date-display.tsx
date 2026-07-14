import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

type DateFormat = 'relative' | 'short' | 'full';

interface DateDisplayProps {
    date: Date | string | number;
    format?: DateFormat;
    showTooltip?: boolean;
    className?: string;
}

const locale = 'ar-EG';
const fallback = 'تاريخ غير معروف';

function parseDate(date: Date | string | number): Date | null {
    if (date instanceof Date) return isNaN(date.getTime()) ? null : date;
    const parsed = new Date(date);
    return isNaN(parsed.getTime()) ? null : parsed;
}

function formatRelative(date: Date): string {
    const now = Date.now();
    const diffMs = date.getTime() - now;
    const absDiffSec = Math.abs(diffMs) / 1000;

    if (absDiffSec < 60) return 'الآن';

    const units: [Intl.RelativeTimeFormatUnit, number][] = [
        ['minute', 60],
        ['hour', 3600],
        ['day', 86400],
        ['week', 604800],
        ['month', 2592000],
        ['year', 31536000],
    ];

    for (const [unit, seconds] of units) {
        const abs = absDiffSec / seconds;
        if (abs < 1.5) {
            const rtf = new Intl.RelativeTimeFormat('ar', { numeric: 'auto' });
            return rtf.format(Math.round(diffMs / 1000 / seconds), unit);
        }
    }

    const rtf = new Intl.RelativeTimeFormat('ar', { numeric: 'auto' });
    return rtf.format(Math.round(diffMs / 1000 / 31536000), 'year');
}

function formatShort(date: Date): string {
    return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(date);
}

function formatFull(date: Date): string {
    return new Intl.DateTimeFormat(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    }).format(date);
}

const formatters: Record<DateFormat, (date: Date) => string> = {
    relative: formatRelative,
    short: formatShort,
    full: formatFull,
};

export default function DateDisplay({
    date,
    format = 'relative',
    showTooltip = false,
    className,
}: DateDisplayProps) {
    const parsed = parseDate(date);
    if (!parsed) {
        return <span className={cn('text-muted-foreground', className)}>{fallback}</span>;
    }

    const formatted = formatters[format](parsed);

    if (!showTooltip) {
        return <span className={className}>{formatted}</span>;
    }

    const fullDate = formatFull(parsed);

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span className={className}>{formatted}</span>
            </TooltipTrigger>
            <TooltipContent>
                <p dir="ltr" className="text-xs">{fullDate}</p>
            </TooltipContent>
        </Tooltip>
    );
}
