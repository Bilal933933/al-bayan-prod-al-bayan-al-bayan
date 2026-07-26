import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { toast } from 'sonner';
import LiveSummaryCard from '@/components/student/attempts/live-summary-card';
import TrainingConfig from '@/components/student/attempts/training-config';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes/student';
import studentCompetitions from '@/routes/student/competitions';
import studentTopics from '@/routes/student/topics';
import type { Competition } from '@/types/competition';

const DEFAULT_QUESTIONS_COUNT = 10;
const SIMULATION_QUESTIONS_COUNT = 25;
const SIMULATION_DURATION_MINUTES = 40;
const SIMULATION_SECTIONS_COUNT = 2;

interface TopicItem {
    id: number;
    name: string;
    default_questions_count: number;
    default_duration_minutes: number | null;
}

interface CreateProps {
    topics: TopicItem[];
    competitions: (Competition & { children?: Competition[] })[];
    topicId?: number | null;
}

export default function Create({ topics, competitions, topicId }: CreateProps) {
    const initialTopic = topicId
        ? topics.find((t) => t.id === topicId)
        : undefined;

    const [mode, setMode] = useState<'training' | 'simulation' | null>(
        topicId ? 'training' : null,
    );
    const [loading, setLoading] = useState(false);

    const [selectedTopic, setSelectedTopic] = useState<number | null>(
        topicId ?? null,
    );
    const [difficulty, setDifficulty] = useState<string | null>(null);
    const [questionsCount, setQuestionsCount] = useState<number>(
        initialTopic?.default_questions_count ?? DEFAULT_QUESTIONS_COUNT,
    );
    const [withTimer, setWithTimer] = useState<boolean>(true);

    const [selectedComp, setSelectedComp] = useState<Competition | null>(null);

    const handleTopicChange = useCallback(
        (id: number) => {
            setSelectedTopic(id);
            const topic = topics.find((t) => t.id === id);

            if (topic) {
                setQuestionsCount(topic.default_questions_count);
                setWithTimer(true);
            }
        },
        [topics],
    );

    const currentTopic = useMemo(
        () => topics.find((t) => t.id === selectedTopic),
        [topics, selectedTopic],
    );

    const summaryData = useMemo(() => {
        if (mode === 'training' && selectedTopic && currentTopic) {
            return {
                topicName: currentTopic.name,
                questionsCount,
                withTimer,
                durationMinutes: withTimer
                    ? (currentTopic.default_duration_minutes ?? 15)
                    : undefined,
                difficulty,
            };
        }

        if (mode === 'simulation' && selectedComp) {
            return {
                title: selectedComp.name,
                questionsCount: SIMULATION_QUESTIONS_COUNT,
                durationMinutes: SIMULATION_DURATION_MINUTES,
                sectionsCount: SIMULATION_SECTIONS_COUNT,
            };
        }

        return {};
    }, [
        mode,
        selectedTopic,
        currentTopic,
        questionsCount,
        withTimer,
        difficulty,
        selectedComp,
    ]);

    const handleModeChange = useCallback(
        (newMode: 'training' | 'simulation') => {
            setMode(newMode);

            if (newMode === 'training') {
                setSelectedComp(null);
            } else {
                setSelectedTopic(null);
            }
        },
        [],
    );

    const handleFinalSubmit = useCallback(() => {
        if (mode === 'training' && selectedTopic) {
            setLoading(true);
            router.post(
                studentTopics.attempts.start({ topic: selectedTopic }).url,
                {
                    difficulty: difficulty,
                    questions_count: questionsCount,
                    with_timer: withTimer,
                },
                {
                    onFinish: () => setLoading(false),
                    onError: (errors) => {
                        const messages = Object.values(errors);

                        if (messages.length > 0) {
                            toast.error(messages[0]);
                        }
                    },
                },
            );
        } else if (mode === 'simulation' && selectedComp) {
            router.visit(
                studentCompetitions.show({ competition: selectedComp.slug })
                    .url,
            );
        }
    }, [
        mode,
        selectedTopic,
        selectedComp,
        difficulty,
        questionsCount,
        withTimer,
    ]);

    return (
        <>
            <Head title="بناء محاولة اختبار جديدة" />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mx-auto max-w-6xl px-4 pt-8 pb-6 text-right"
                dir="rtl"
            >
                <div className="mb-8 flex items-center justify-between">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black text-foreground">
                            تجهيز محاولة جديدة
                        </h1>
                        <p className="text-xs font-bold text-muted-foreground">
                            اختر أسلوب الاختبار والتحقق الذي يناسب خطتك الدراسية
                            الحالية.
                        </p>
                    </div>
                    <Link
                        href={dashboard().url}
                        className="flex items-center gap-1.5 rounded-xl border border-border bg-muted px-4 py-2 text-xs font-black text-muted-foreground transition-all hover:bg-muted/80"
                    >
                        <ArrowRight className="h-4 w-4" />
                        <span>رجوع للوحة التحكم</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-10">
                    <div className="space-y-8 rounded-3xl border border-border bg-card p-6 shadow-xs lg:col-span-6">
                        <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-3 text-sm dark:border-blue-900 dark:bg-blue-950/20">
                            <p>
                                <span className="font-semibold">
                                    📘 أول مرة تخوض الاختبار؟
                                </span>{' '}
                                <Link
                                    href="/guide/exam-day"
                                    className="text-primary underline underline-offset-2"
                                >
                                    اقرأ دليل يوم الاختبار
                                </Link>{' '}
                                — تعرف على ترتيب القاعة، المستندات المطلوبة،
                                وآلية الامتحان.
                            </p>
                        </div>

                        <div>
                            <label className="mb-3 block text-sm font-black text-foreground">
                                اختر مسار التقييم:
                            </label>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={() => handleModeChange('training')}
                                    className={cn(
                                        'relative rounded-2xl border-2 p-5 text-right transition-all duration-300',
                                        mode === 'training'
                                            ? 'scale-[1.01] border-primary bg-primary/5 shadow-md'
                                            : 'border-border opacity-60 hover:opacity-100',
                                    )}
                                >
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <BookOpen className="h-5 w-5" />
                                    </div>
                                    <span className="block text-base font-black text-foreground">
                                        تدريب حر ومرن
                                    </span>
                                    <span className="mt-1 block text-xs leading-relaxed font-bold text-muted-foreground">
                                        تخصيص كامل لعدد الأسئلة، تحديد مستوى
                                        الصعوبة، مع خيار إيقاف المؤقت.
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        handleModeChange('simulation')
                                    }
                                    className={cn(
                                        'relative rounded-2xl border-2 p-5 text-right transition-all duration-300',
                                        mode === 'simulation'
                                            ? 'scale-[1.01] border-info bg-info/5 shadow-md'
                                            : 'border-border opacity-60 hover:opacity-100',
                                    )}
                                >
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-info/10 text-info">
                                        <GraduationCap className="h-5 w-5" />
                                    </div>
                                    <span className="block text-base font-black text-foreground">
                                        اختبار محاكاة رسمي
                                    </span>
                                    <span className="mt-1 block text-xs leading-relaxed font-bold text-muted-foreground">
                                        خوض اختبارات المسابقات الرسمية الموزعة
                                        بمؤقت زمني صارم وشروط حقيقية.
                                    </span>
                                </button>
                            </div>
                        </div>

                        {mode === 'training' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <TrainingConfig
                                    topics={topics}
                                    selectedTopic={selectedTopic}
                                    onTopicSelect={handleTopicChange}
                                    difficulty={difficulty}
                                    onDifficultySelect={setDifficulty}
                                    questionsCount={questionsCount}
                                    onQuestionsCountChange={setQuestionsCount}
                                    withTimer={withTimer}
                                    onTimerToggle={setWithTimer}
                                />
                            </motion.div>
                        )}

                        {mode === 'simulation' && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-4"
                            >
                                <label className="mb-2 block text-sm font-black text-foreground">
                                    اختر مسابقة رسمية من المسابقات المفعلة:
                                </label>
                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {competitions.map((comp) => (
                                        <button
                                            key={comp.id}
                                            type="button"
                                            onClick={() =>
                                                setSelectedComp(comp)
                                            }
                                            className={cn(
                                                'rounded-xl border p-4 text-right transition-all',
                                                selectedComp?.id === comp.id
                                                    ? 'border-info bg-info/10 font-black text-info'
                                                    : 'border-border bg-muted text-foreground hover:bg-muted/80',
                                            )}
                                        >
                                            <span className="block text-sm font-bold">
                                                {comp.name}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </div>

                    <div className="lg:col-span-4">
                        <LiveSummaryCard
                            mode={mode}
                            data={summaryData}
                            onSubmit={handleFinalSubmit}
                            loading={loading}
                        />
                    </div>
                </div>
            </motion.div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [],
};
