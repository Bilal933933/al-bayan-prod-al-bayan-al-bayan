import { cn } from '@/lib/utils';
import type { PeriodOption } from '@/types/leaderboard';

interface FilterTabsProps {
    periods: PeriodOption[];
    currentPeriod: string;
    onChange: (key: string) => void;
}

export function FilterTabs({ periods, currentPeriod, onChange }: FilterTabsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {periods.map((period) => (
                <button
                    key={period.key}
                    onClick={() => onChange(period.key)}
                    className={cn(
                        'cursor-pointer rounded-full px-5 py-2 text-sm font-medium transition-all duration-200',
                        currentPeriod === period.key
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700',
                    )}
                >
                    {period.label}
                </button>
            ))}
        </div>
    );
}
