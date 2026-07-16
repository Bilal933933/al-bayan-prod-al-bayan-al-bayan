import { Link } from '@inertiajs/react';
import { BookOpen, ChevronRight, Clock, GraduationCap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { dashboard } from '@/routes/student';

interface ExamHeaderProps {
    type: 'practice' | 'exam';
    sectionName: string;
    sectionIndex: number;
    totalSections: number;
    totalMinutes: number;
    elapsedSeconds: number;
}

export function ExamHeader({ type, sectionName, sectionIndex, totalSections, totalMinutes, elapsedSeconds }: ExamHeaderProps) {
    const remaining = Math.max(0, totalMinutes * 60 - elapsedSeconds);
    const remainingMinutes = Math.floor(remaining / 60);
    const remainingSeconds = remaining % 60;
    const timerDisplay = `${String(remainingMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

    const isUrgent = remaining <= 300;
    const isCritical = remaining <= 60;

    const timerClass = isCritical
        ? 'text-red-600 animate-pulse'
        : isUrgent
            ? 'text-amber-600'
            : 'text-muted-foreground';

    return (
        <header className="sticky top-0 z-50 border-b bg-white shadow-xs">
            <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
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
                        <span className={`flex items-center gap-1.5 text-sm font-medium tabular-nums ${timerClass}`}>
                            <Clock className="h-4 w-4" />
                            {timerDisplay}
                        </span>
                    )}
                </div>
            </div>
        </header>
    );
}
