import { cn } from '@/lib/utils';
import type { RecentAttempt } from '@/types/dashboard';

interface AttemptRowProps {
    attempt: RecentAttempt;
}

export function AttemptRow({ attempt }: AttemptRowProps) {
    const accuracy =
        attempt.total_questions > 0
            ? Math.round(
                  (attempt.correct_answers / attempt.total_questions) * 100,
              )
            : 0;

    return (
        <div className="group flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 transition-all duration-200 hover:border-slate-200 hover:shadow-sm">
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 font-bold text-slate-700 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-700">
                    {attempt.user.name.charAt(0)}
                </div>

                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <h4 className="truncate text-sm font-bold text-slate-800">
                            {attempt.user.name}
                        </h4>
                        {attempt.user.streak_days > 0 && (
                            <span className="shrink-0 rounded-md bg-amber-50 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-700">
                                {attempt.user.streak_days}
                            </span>
                        )}
                    </div>
                    <p className="mt-0.5 truncate text-xs font-medium text-slate-400">
                        {attempt.competition?.name ??
                            attempt.topic?.name ??
                            '—'}
                    </p>
                </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
                <span
                    className={cn(
                        'rounded-full px-2 py-1 text-[11px] font-bold',
                        attempt.type === 'exam'
                            ? 'border border-purple-100 bg-purple-50 text-purple-700'
                            : 'border border-blue-100 bg-blue-50 text-blue-700',
                    )}
                >
                    {attempt.type === 'exam' ? 'اختبار' : 'تدريب'}
                </span>

                <div className="min-w-[52px] text-center">
                    <span className="block text-xs font-black text-slate-700">
                        {attempt.correct_answers}/{attempt.total_questions}
                    </span>
                    <span className="block text-[10px] font-medium text-slate-400">
                        {accuracy}%
                    </span>
                </div>

                <div className="min-w-[60px] text-left">
                    <span className="block text-sm font-black text-emerald-600">
                        +{attempt.score?.points ?? 0}
                    </span>
                    <span className="block text-[10px] font-medium text-slate-400">
                        نقاط
                    </span>
                </div>

                <span
                    className={cn(
                        'inline-block h-2 w-2 rounded-full',
                        attempt.status === 'completed' && 'bg-emerald-500',
                        attempt.status === 'in_progress' &&
                            'animate-pulse bg-amber-400',
                        attempt.status === 'abandoned' && 'bg-slate-300',
                    )}
                    title={
                        attempt.status === 'completed'
                            ? 'مكتملة'
                            : attempt.status === 'in_progress'
                              ? 'قيد التنفيذ'
                              : 'ملغاة'
                    }
                />
            </div>
        </div>
    );
}
