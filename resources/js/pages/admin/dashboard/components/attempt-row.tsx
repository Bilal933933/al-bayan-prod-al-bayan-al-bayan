import { cn } from '@/lib/utils';
import type { RecentAttempt } from '@/types/dashboard';

interface AttemptRowProps {
    attempt: RecentAttempt;
}

export function AttemptRow({ attempt }: AttemptRowProps) {
    const accuracy = attempt.total_questions > 0
        ? Math.round((attempt.correct_answers / attempt.total_questions) * 100)
        : 0;

    return (
        <div className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all duration-200 group">
            <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-slate-700 shrink-0 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                    {attempt.user.name.charAt(0)}
                </div>

                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-slate-800 truncate">{attempt.user.name}</h4>
                        {attempt.user.streak_days > 0 && (
                            <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded-md font-extrabold shrink-0">
                                {attempt.user.streak_days}
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium truncate">
                        {attempt.competition?.name ?? attempt.topic?.name ?? '—'}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
                <span className={cn(
                    'text-[11px] font-bold px-2 py-1 rounded-full',
                    attempt.type === 'exam'
                        ? 'bg-purple-50 text-purple-700 border border-purple-100'
                        : 'bg-blue-50 text-blue-700 border border-blue-100',
                )}>
                    {attempt.type === 'exam' ? 'اختبار' : 'تدريب'}
                </span>

                <div className="text-center min-w-[52px]">
                    <span className="text-xs font-black text-slate-700 block">
                        {attempt.correct_answers}/{attempt.total_questions}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">{accuracy}%</span>
                </div>

                <div className="text-left min-w-[60px]">
                    <span className="text-sm font-black text-emerald-600 block">
                        +{attempt.score?.points ?? 0}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">نقاط</span>
                </div>

                <span className={cn(
                    'inline-block w-2 h-2 rounded-full',
                    attempt.status === 'completed' && 'bg-emerald-500',
                    attempt.status === 'in_progress' && 'bg-amber-400 animate-pulse',
                    attempt.status === 'abandoned' && 'bg-slate-300',
                )} title={
                    attempt.status === 'completed' ? 'مكتملة'
                    : attempt.status === 'in_progress' ? 'قيد التنفيذ'
                    : 'ملغاة'
                } />
            </div>
        </div>
    );
}
