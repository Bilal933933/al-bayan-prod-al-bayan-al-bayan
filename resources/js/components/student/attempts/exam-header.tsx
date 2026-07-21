import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes/student';

const URGENT_THRESHOLD = 300;
const CRITICAL_THRESHOLD = 60;
const SIZE = 40;
const STROKE = 3;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = RADIUS * 2 * Math.PI;

interface ExamHeaderProps {
    type: 'practice' | 'exam';
    sectionName: string;
    sectionIndex: number;
    totalSections: number;
    totalMinutes: number;
    elapsedSeconds: number;
}

export function ExamHeader({ type, sectionName, sectionIndex, totalSections, totalMinutes, elapsedSeconds }: ExamHeaderProps) {
    const totalSeconds = totalMinutes * 60;
    const remaining = Math.max(0, totalSeconds - elapsedSeconds);
    const remainingMinutes = Math.floor(remaining / 60);
    const remainingSeconds = remaining % 60;
    const timerDisplay = `${String(remainingMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

    const isUrgent = remaining <= URGENT_THRESHOLD;
    const isCritical = remaining <= CRITICAL_THRESHOLD;
    const progressPct = totalMinutes > 0 ? (elapsedSeconds / totalSeconds) * 100 : 0;
    const circularProgress = totalMinutes > 0 ? remaining / totalSeconds : 1;
    const dashoffset = CIRCUMFERENCE * (1 - circularProgress);

    const timerColor = isCritical
        ? '#dc2626'
        : isUrgent
            ? '#d97706'
            : '#16a34a';

    const barClass = isCritical
        ? 'bg-destructive'
        : isUrgent
            ? 'bg-warning'
            : 'bg-primary';

    return (
        <header className="sticky top-0 z-50 border-b bg-background shadow-xs" role="banner" aria-label="شريط معلومات الاختبار">
            <div className="relative mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
                <div className="flex items-center gap-3">
                    <Link href={dashboard()} className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
                        <GraduationCap className="h-4 w-4" />
                        <span className="hidden sm:inline">البَيان</span>
                    </Link>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="truncate text-sm font-medium">{sectionName}</span>
                    <span className="text-xs text-muted-foreground">
                        ({sectionIndex + 1}/{totalSections})
                    </span>
                </div>

                <div className="flex items-center gap-3">
                    <Badge variant={type === 'exam' ? 'destructive' : 'secondary'} className="shrink-0">
                        {type === 'exam' ? (
                            <><GraduationCap className="ml-1 h-3 w-3" />محاكاة</>
                        ) : (
                            <><BookOpen className="ml-1 h-3 w-3" />تدريب</>
                        )}
                    </Badge>

                    {totalMinutes > 0 && (
                        <div className="flex items-center gap-2">
                            <div className="relative flex items-center justify-center" style={{ width: SIZE, height: SIZE }}>
                                <svg width={SIZE} height={SIZE} className="-rotate-90">
                                    <circle
                                        cx={SIZE / 2}
                                        cy={SIZE / 2}
                                        r={RADIUS}
                                        fill="none"
                                        stroke="#e5e7eb"
                                        strokeWidth={STROKE}
                                    />
                                    <motion.circle
                                        cx={SIZE / 2}
                                        cy={SIZE / 2}
                                        r={RADIUS}
                                        fill="none"
                                        stroke={timerColor}
                                        strokeWidth={STROKE}
                                        strokeLinecap="round"
                                        strokeDasharray={CIRCUMFERENCE}
                                        animate={{ strokeDashoffset: dashoffset }}
                                        transition={{ duration: 0.5, ease: 'easeOut' }}
                                    />
                                </svg>
                                <span className={`absolute text-[10px] font-bold tabular-nums ${isCritical ? 'text-destructive' : isUrgent ? 'text-warning' : 'text-muted-foreground'}`}>
                                    {remainingMinutes}
                                </span>
                            </div>
                            <span className={`hidden sm:flex items-center gap-1.5 text-sm font-medium tabular-nums ${isCritical ? 'text-destructive animate-pulse' : isUrgent ? 'text-warning' : 'text-muted-foreground'}`} aria-live="polite" aria-atomic="true">
                                {timerDisplay}
                            </span>
                            <span className={`sm:hidden text-xs font-bold tabular-nums ${isCritical ? 'text-destructive' : isUrgent ? 'text-warning' : 'text-muted-foreground'}`}>
                                {timerDisplay}
                            </span>
                        </div>
                    )}
                </div>
            </div>
            {totalMinutes > 0 && (
                <div className="h-0.5 w-full bg-muted/50">
                    <div
                        className={`h-full transition-all duration-1000 ease-linear ${barClass}`}
                        style={{ width: `${Math.min(progressPct, 100)}%` }}
                    />
                </div>
            )}
        </header>
    );
}
