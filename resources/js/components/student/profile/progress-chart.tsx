import { TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ProfileSection } from '@/components/student/profile/profile-section';
import type { MonthlyScore } from '@/types/profile';

interface ProgressChartProps {
    data: MonthlyScore[];
}

export function ProgressChart({ data }: ProgressChartProps) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                }
            },
            { threshold: 0.1 },
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    if (!data.length) return null;

    const maxVal = Math.max(...data.map((d) => d.percentage), 10);

    return (
        <ProfileSection
            icon={<TrendingUp className="h-4 w-4" />}
            title="تطور الأداء الشهري"
        >
            <div
                ref={ref}
                className="flex items-end gap-2 pt-5"
                style={{ height: 180 }}
            >
                {data.map((item, i) => {
                    const heightPct = (item.percentage / maxVal) * 100;
                    return (
                        <div
                            key={i}
                            className="flex flex-1 flex-col items-center gap-1.5"
                        >
                            <div
                                className="group relative w-full rounded-t-md bg-gradient-to-t from-brand-teal to-brand-teal-soft transition-all duration-700"
                                style={{
                                    height: visible ? `${heightPct}%` : '0%',
                                    minHeight: visible ? 4 : 0,
                                }}
                            >
                                <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs font-bold whitespace-nowrap text-background opacity-0 transition-opacity group-hover:opacity-100">
                                    {item.percentage}%
                                </span>
                            </div>
                            <span className="text-xs text-muted-foreground">
                                {item.month}
                            </span>
                        </div>
                    );
                })}
            </div>
        </ProfileSection>
    );
}
