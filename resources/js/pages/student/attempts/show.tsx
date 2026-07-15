import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Check,
    CheckCircle,
    ChevronDown,
    ChevronLeft,
    Clock,
    HelpCircle,
    House,
    List,
    Map,
    X,
    XCircle,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import attempts from '@/routes/student/attempts';
import type { Attempt, AttemptQuestion, AttemptSection } from '@/types/attempt';

interface ShowProps {
    attempt: Attempt;
}

const typeLabels: Record<string, string> = {
    practice: 'تدريب حر',
    exam: 'محاكاة اختبار',
};

const statusConfig: Record<string, { label: string; classes: string }> = {
    in_progress: { label: 'قيد التنفيذ', classes: 'bg-blue-100 text-blue-700 border-blue-200' },
    completed: { label: 'مكتمل', classes: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
    abandoned: { label: 'ملغي', classes: 'bg-gray-100 text-gray-600 border-gray-200' },
};

const difficultyLabels: Record<string, string> = {
    easy: 'سهل',
    medium: 'متوسط',
    hard: 'صعب',
};

const difficultyColors: Record<string, string> = {
    easy: 'bg-emerald-100 text-emerald-700',
    medium: 'bg-amber-100 text-amber-700',
    hard: 'bg-red-100 text-red-700',
};

function formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}س ${m}د`;
    if (m > 0) return `${m}د ${s}ث`;
    return `${s}ث`;
}

function formatTime(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function getDurationSeconds(startedAt: string, finishedAt: string | null): number {
    if (!finishedAt) return 0;
    return Math.max(0, Math.round((new Date(finishedAt).getTime() - new Date(startedAt).getTime()) / 1000));
}

function ScoreCircle({ percentage }: { percentage: number }) {
    const radius = 48;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    const color = percentage >= 70 ? '#10b981' : percentage >= 40 ? '#f59e0b' : '#ef4444';

    return (
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
            <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
                <circle cx="64" cy="64" r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
                <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-700 ease-out"
                    style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
                />
            </svg>
            <span className="absolute text-3xl font-extrabold" style={{ color }}>
                {percentage}%
            </span>
        </div>
    );
}

function StatBadge({ count, label, color }: { count: number; label: string; color: string }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <div className={cn('text-xl font-bold', color)}>
                {count}
            </div>
            <span className="text-[11px] text-slate-500">{label}</span>
        </div>
    );
}

function OptionCard({
    option,
    isSelected,
    isCorrectOption,
    isCompleted,
    showCorrect,
    showWrong,
}: {
    option: { id: number; text: string; is_correct: boolean };
    isSelected: boolean;
    isCorrectOption: boolean;
    isCompleted: boolean;
    showCorrect: boolean;
    showWrong: boolean;
}) {
    return (
        <div
            className={cn(
                'flex items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-sm transition-all',
                showCorrect && 'border-emerald-200 bg-emerald-50/80 shadow-sm',
                showWrong && 'border-rose-200 bg-rose-50/80 shadow-sm',
                !showCorrect && !showWrong && isCompleted && 'border-slate-100 bg-slate-50/50 opacity-50',
                !showCorrect && !showWrong && !isCompleted && 'border-slate-200 bg-white hover:border-slate-300',
            )}
        >
            <span
                className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold',
                    showCorrect && 'bg-emerald-500 text-white shadow-sm shadow-emerald-200',
                    showWrong && 'bg-rose-500 text-white shadow-sm shadow-rose-200',
                    !showCorrect && !showWrong && 'border-2 border-slate-300 text-transparent',
                )}
            >
                {showCorrect ? <Check className="h-3 w-3" /> : showWrong ? <X className="h-3 w-3" /> : ''}
            </span>
            <span
                className={cn(
                    'flex-1 leading-relaxed',
                    showCorrect && 'font-medium text-emerald-800',
                    showWrong && 'font-medium text-rose-800',
                )}
            >
                {option.text}
            </span>
        </div>
    );
}

function QuestionCard({ question, attempt, questionId }: { question: AttemptQuestion; attempt: Attempt; questionId: string }) {
    const isCompleted = attempt.status === 'completed';
    const hasCorrect = question.is_correct === true;
    const hasWrong = question.is_correct === false;

    return (
        <div id={questionId} className="scroll-mt-20 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="mb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                        {question.order + 1}
                    </span>
                    <span className={cn('rounded-md px-2 py-0.5 text-[11px] font-medium', difficultyColors[question.question.difficulty] ?? 'bg-slate-100 text-slate-600')}>
                        {difficultyLabels[question.question.difficulty] ?? question.question.difficulty}
                    </span>
                </div>
                {isCompleted && hasCorrect && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 ring-1 ring-emerald-200">
                        <Check className="h-3 w-3" />
                        صحيحة
                    </span>
                )}
                {isCompleted && hasWrong && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-medium text-rose-600 ring-1 ring-rose-200">
                        <X className="h-3 w-3" />
                        خاطئة
                    </span>
                )}
            </div>

            <p className="mb-4 text-sm leading-relaxed text-slate-800 sm:text-base">
                {question.question.text}
            </p>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {question.question.options?.map((option) => {
                    const textLen = option.text?.length ?? 0;
                    const isLong = textLen > 30;

                    return (
                        <div key={option.id} className={isLong ? 'sm:col-span-2' : ''}>
                            <OptionCard
                                option={option}
                                isSelected={question.selected_option_id === option.id}
                                isCorrectOption={option.is_correct}
                                isCompleted={isCompleted}
                                showCorrect={isCompleted && option.is_correct === true}
                                showWrong={isCompleted && question.selected_option_id === option.id && option.is_correct === false}
                            />
                        </div>
                    );
                })}
            </div>

            {isCompleted && hasWrong && question.question.explanation && (
                <div className="mt-4 rounded-xl bg-amber-50/80 p-4 text-sm leading-relaxed text-amber-800 ring-1 ring-amber-200/50">
                    <span className="font-semibold">الشرح: </span>
                    {question.question.explanation}
                </div>
            )}
        </div>
    );
}

function SectionBlock({ section, attempt, filter }: { section: AttemptSection; attempt: Attempt; filter: string }) {
    const correctCount = section.questions.filter((q) => q.is_correct === true).length;
    const wrongCount = section.questions.filter((q) => q.is_correct === false).length;
    const unansweredCount = section.questions.filter((q) => q.is_correct === null).length;

    const filteredQuestions = section.questions.filter((q) => {
        if (filter === 'wrong') return q.is_correct === false;
        if (filter === 'unanswered') return q.is_correct === null;
        return true;
    });

    return (
        <Collapsible defaultOpen>
            <CollapsibleTrigger className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-right shadow-sm transition-all hover:shadow-md">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <ChevronDown className="h-4 w-4 text-primary transition-transform group-data-[state=open]:rotate-180" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">{section.topic?.name ?? `القسم ${section.order + 1}`}</span>
                        {section.submitted_at && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 ring-1 ring-emerald-200">
                                تم التسليم
                            </span>
                        )}
                        {filter !== 'all' && (
                            <span className="text-xs text-muted-foreground">
                                ({filteredQuestions.length} من {section.questions.length})
                            </span>
                        )}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs leading-relaxed">
                        <span className="text-slate-500">{section.questions.length} أسئلة</span>
                        <span className="text-slate-300" aria-hidden="true">•</span>
                        <span className="font-medium text-emerald-600">{correctCount} صحيح</span>
                        <span className="text-slate-300" aria-hidden="true">•</span>
                        <span className="font-medium text-rose-600">{wrongCount} خطأ</span>
                        {unansweredCount > 0 && (
                            <>
                                <span className="text-slate-300" aria-hidden="true">•</span>
                                <span className="font-medium text-slate-400">{unansweredCount} لم يُجب</span>
                            </>
                        )}
                    </div>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3">
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question) => (
                        <QuestionCard
                            key={question.id}
                            question={question}
                            attempt={attempt}
                            questionId={`question-${question.question_id}`}
                        />
                    ))
                ) : (
                    <p className="py-6 text-center text-sm text-slate-400">لا توجد أسئلة في هذا التصنيف</p>
                )}
            </CollapsibleContent>
        </Collapsible>
    );
}

function NavigationGrid({
    questions,
    allQuestions,
    onQuestionClick,
}: {
    questions: { question_id: number; is_correct: boolean | null; order: number }[];
    allQuestions: { question_id: number; is_correct: boolean | null; order: number }[];
    onQuestionClick?: () => void;
}) {
    const handleClick = useCallback((questionId: number) => {
        const el = document.getElementById(`question-${questionId}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        onQuestionClick?.();
    }, [onQuestionClick]);

    return (
        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200/50">
            <div className="mb-3 text-xs font-medium text-slate-500">خريطة الأسئلة</div>
            <div className="grid grid-cols-5 gap-1.5" dir="rtl">
                {allQuestions.map((q, i) => {
                    const isVisible = questions.some((fq) => fq.question_id === q.question_id);
                    const isCorrect = q.is_correct === true;
                    const isWrong = q.is_correct === false;

                    return (
                        <button
                            key={q.question_id}
                            onClick={() => handleClick(q.question_id)}
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold transition-all hover:scale-110 hover:shadow-md',
                                isCorrect && 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
                                isWrong && 'bg-rose-100 text-rose-800 hover:bg-rose-200',
                                q.is_correct === null && 'bg-slate-100 text-slate-600 hover:bg-slate-200',
                                !isVisible && 'opacity-30',
                            )}
                            title={`سؤال ${i + 1}`}
                        >
                            {i + 1}
                        </button>
                    );
                })}
            </div>
            <div className="mt-3 flex items-center justify-center gap-3 text-[10px]">
                <span className="flex items-center gap-1 text-emerald-700">
                    <span className="inline-block h-2.5 w-2.5 rounded bg-emerald-100 ring-1 ring-emerald-200" />
                    صحيح
                </span>
                <span className="flex items-center gap-1 text-rose-700">
                    <span className="inline-block h-2.5 w-2.5 rounded bg-rose-100 ring-1 ring-rose-200" />
                    خطأ
                </span>
                <span className="flex items-center gap-1 text-slate-500">
                    <span className="inline-block h-2.5 w-2.5 rounded bg-slate-100 ring-1 ring-slate-200" />
                    لم يُجب
                </span>
            </div>
        </div>
    );
}

const FILTERS = [
    { value: 'all', label: 'الكل' },
    { value: 'wrong', label: 'الخاطئة', countKey: 'wrong' as const },
    { value: 'unanswered', label: 'لم تُجب', countKey: 'unanswered' as const },
] as const;

export default function Show({ attempt }: ShowProps) {
    const [filter, setFilter] = useState<string>('all');
    const [navOpen, setNavOpen] = useState(false);
    const statusInfo = statusConfig[attempt.status] ?? { label: attempt.status, classes: 'bg-gray-100 text-gray-600' };

    const correctCount = attempt.sections.reduce((acc, s) => acc + s.questions.filter((q) => q.is_correct === true).length, 0);
    const wrongCount = attempt.sections.reduce((acc, s) => acc + s.questions.filter((q) => q.is_correct === false).length, 0);
    const unansweredCount = attempt.sections.reduce((acc, s) => acc + s.questions.filter((q) => q.is_correct === null).length, 0);
    const percentage = attempt.total_questions > 0 ? Math.round((correctCount / attempt.total_questions) * 100) : 0;

    const durationSeconds = getDurationSeconds(attempt.started_at, attempt.finished_at);

    const allQuestions = attempt.sections.flatMap((s) =>
        s.questions.map((q) => ({ question_id: q.question_id, is_correct: q.is_correct, order: q.order })),
    );

    const filteredQuestionIds = new Set(
        attempt.sections.flatMap((s) => {
            const qs = s.questions.filter((q) => {
                if (filter === 'wrong') return q.is_correct === false;
                if (filter === 'unanswered') return q.is_correct === null;
                return true;
            });
            return qs.map((q) => q.question_id);
        }),
    );

    const filteredNavQuestions = allQuestions.filter((q) => filteredQuestionIds.has(q.question_id));

    const sidebarContent = (
        <>
            <div className="flex flex-col items-center gap-4 py-6">
                <ScoreCircle percentage={percentage} />
                <div className="flex items-center justify-center gap-5">
                    <StatBadge count={correctCount} label="صحيحة" color="text-emerald-600" />
                    <StatBadge count={wrongCount} label="خاطئة" color="text-rose-600" />
                    {unansweredCount > 0 && (
                        <StatBadge count={unansweredCount} label="لم تُجب" color="text-slate-400" />
                    )}
                </div>
            </div>

            <NavigationGrid
                questions={filteredNavQuestions}
                allQuestions={allQuestions}
                onQuestionClick={() => setNavOpen(false)}
            />
        </>
    );

    return (
        <>
            <Head title={`مراجعة ${typeLabels[attempt.type] ?? 'محاولة'}`} />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="min-h-screen bg-slate-50"
            >
                <div className="mx-auto flex max-w-7xl flex-col gap-6 p-4 sm:p-6 lg:grid lg:grid-cols-[1fr_320px]">
                    {/* ── Main Content ── */}
                    <div className="flex flex-col gap-5">
                        {/* Breadcrumb */}
                        <nav className="flex items-center gap-1.5 px-5 text-sm text-muted-foreground sm:px-6">
                            <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
                                <House className="h-3.5 w-3.5" />
                                <span>الرئيسية</span>
                            </Link>
                            <ChevronLeft className="h-3.5 w-3.5" />
                            <Link href={attempts.index()} className="inline-flex items-center gap-1 transition-colors hover:text-foreground">
                                <List className="h-3.5 w-3.5" />
                                <span>محاولاتي</span>
                            </Link>
                            <ChevronLeft className="h-3.5 w-3.5" />
                            <span className="font-medium text-foreground">مراجعة</span>
                        </nav>

                        {/* Compact Hero */}
                        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200/50 sm:p-6">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <h1 className="text-xl font-bold sm:text-2xl">{attempt.subject_name}</h1>
                                    <div className="mt-1 flex flex-wrap items-center gap-2">
                                        <span className={cn('rounded-full border px-2.5 py-0.5 text-[11px] font-medium', statusInfo.classes)}>
                                            {statusInfo.label}
                                        </span>
                                        <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                                            {typeLabels[attempt.type] ?? attempt.type}
                                        </span>
                                        <span className="text-xs text-slate-400">{attempt.total_questions} سؤال</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        {formatDuration(durationSeconds)}
                                    </span>
                                    <span className="text-slate-300">|</span>
                                    <span>{formatTime(attempt.started_at)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Filters */}
                        <div className="flex items-center gap-1.5 overflow-x-auto">
                            {FILTERS.map((f) => (
                                <button
                                    key={f.value}
                                    onClick={() => setFilter(f.value)}
                                    className={cn(
                                        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 py-1.5 text-xs font-medium transition-all',
                                        filter === f.value
                                            ? 'bg-primary text-primary-foreground shadow-sm'
                                            : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50',
                                    )}
                                >
                                    {f.label}
                                    {f.countKey && (
                                        <span
                                            className={cn(
                                                'inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-bold',
                                                filter === f.value ? 'bg-white/20' : 'bg-slate-100 text-slate-500',
                                            )}
                                        >
                                            {f.countKey === 'wrong' ? wrongCount : unansweredCount}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Section Blocks */}
                        {attempt.sections.map((section) => (
                            <SectionBlock key={section.id} section={section} attempt={attempt} filter={filter} />
                        ))}
                    </div>

                    {/* ── Sidebar (Desktop) ── */}
                    <div className="hidden flex-col gap-5 lg:sticky lg:top-6 lg:flex lg:self-start">
                        {/* Score Card */}
                        <div className="flex flex-col items-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/50">
                            {sidebarContent}
                        </div>
                    </div>
                </div>

                {/* ── Mobile FAB + Sheet ── */}
                <div className="fixed bottom-6 right-6 z-50 lg:hidden">
                    <Sheet open={navOpen} onOpenChange={setNavOpen}>
                        <SheetTrigger asChild>
                            <button className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95">
                                <Map className="h-5 w-5" />
                            </button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="rounded-t-2xl">
                            <div className="pb-4">
                                {sidebarContent}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </motion.div>
        </>
    );
}
