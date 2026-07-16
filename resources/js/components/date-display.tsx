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
const rtf = new Intl.RelativeTimeFormat('ar', { numeric: 'auto' });

function parseDate(date: Date | string | number): Date | null {
    if (date instanceof Date) {
        return isNaN(date.getTime()) ? null : date;
    }

    const parsed = new Date(date);

    return isNaN(parsed.getTime()) ? null : parsed;
}

function formatRelative(date: Date): string {
    const now = Date.now();
    const diffMs = date.getTime() - now;
    const diffSec = Math.round(diffMs / 1000);
    const absDiff = Math.abs(diffSec);

    if (absDiff < 5) {
        return 'الآن';
    }

    if (absDiff < 60) {
        return rtf.format(diffSec, 'second');
    }

    const diffMin = Math.round(diffSec / 60);

    if (Math.abs(diffMin) < 60) {
        return rtf.format(diffMin, 'minute');
    }

    const diffHour = Math.round(diffSec / 3600);

    if (Math.abs(diffHour) < 24) {
        return rtf.format(diffHour, 'hour');
    }

    const diffDay = Math.round(diffSec / 86400);

    if (Math.abs(diffDay) < 7) {
        return rtf.format(diffDay, 'day');
    }

    const diffWeek = Math.round(diffSec / 604800);

    if (Math.abs(diffWeek) < 5) {
        return rtf.format(diffWeek, 'week');
    }

    const diffMonth = Math.round(diffSec / 2592000);

    if (Math.abs(diffMonth) < 12) {
        return rtf.format(diffMonth, 'month');
    }

    const diffYear = Math.round(diffSec / 31536000);

    return rtf.format(diffYear, 'year');
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
