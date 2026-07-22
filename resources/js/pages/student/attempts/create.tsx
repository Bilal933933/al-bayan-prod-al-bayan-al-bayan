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
}

export default function Create({ topics, competitions }: CreateProps) {
    const initialTopicId = (() => {
        const params = new URLSearchParams(window.location.search);
        const topicId = params.get('topic');

        if (topicId && topics.find((t) => t.id === Number(topicId))) {
            return Number(topicId);
        }

        return null;
    })();

    const initialTopic = initialTopicId
        ? topics.find((t) => t.id === initialTopicId)
        : undefined;

    const [mode, setMode] = useState<'training' | 'simulation' | null>(
        initialTopicId ? 'training' : null,
    );
    const [loading, setLoading] = useState(false);

    const [selectedTopic, setSelectedTopic] = useState<number | null>(initialTopicId);
    const [difficulty, setDifficulty] = useState<string | null>(null);
    const [questionsCount, setQuestionsCount] = useState<number>(
        initialTopic?.default_questions_count ?? DEFAULT_QUESTIONS_COUNT,
    );
    const [withTimer, setWithTimer] = useState<boolean>(true);

    const [selectedComp, setSelectedComp] = useState<Competition | null>(null);

    const handleTopicChange = useCallback((id: number) => {
        setSelectedTopic(id);
        const topic = topics.find((t) => t.id === id);

        if (topic) {
            setQuestionsCount(topic.default_questions_count);
            setWithTimer(true);
        }
    }, [topics]);

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
                durationMinutes: withTimer ? (currentTopic.default_duration_minutes ?? 15) : undefined,
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
    }, [mode, selectedTopic, currentTopic, questionsCount, withTimer, difficulty, selectedComp]);

    const handleModeChange = useCallback((newMode: 'training' | 'simulation') => {
        setMode(newMode);

        if (newMode === 'training') {
            setSelectedComp(null);
        } else {
            setSelectedTopic(null);
        }
    }, []);

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
            router.visit(studentCompetitions.show({ competition: selectedComp.slug }).url);
        }
    }, [mode, selectedTopic, selectedComp, difficulty, questionsCount, withTimer]);

    return (
        <>
            <Head title="بناء محاولة اختبار جديدة" />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="max-w-6xl mx-auto px-4 pt-8 pb-6 text-right"
                dir="rtl"
            >
                <div className="flex justify-between items-center mb-8">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black text-foreground">تجهيز محاولة جديدة</h1>
                        <p className="text-xs font-bold text-muted-foreground">
                            اختر أسلوب الاختبار والتحقق الذي يناسب خطتك الدراسية الحالية.
                        </p>
                    </div>
                    <Link
                        href={dashboard().url}
                        className="flex items-center gap-1.5 text-xs font-black text-muted-foreground bg-muted hover:bg-muted/80 px-4 py-2 rounded-xl transition-all border border-border"
                    >
                        <ArrowRight className="w-4 h-4" />
                        <span>رجوع للوحة التحكم</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
                    <div className="lg:col-span-6 space-y-8 bg-card p-6 rounded-3xl border border-border shadow-xs">
                        <div>
                            <label className="block text-sm font-black text-foreground mb-3">اختر مسار التقييم:</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleModeChange('training')}
                                    className={cn(
                                        'p-5 rounded-2xl border-2 text-right transition-all duration-300 relative',
                                        mode === 'training'
                                            ? 'border-primary bg-primary/5 shadow-md scale-[1.01]'
                                            : 'border-border opacity-60 hover:opacity-100',
                                    )}
                                >
                                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-3">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <span className="font-black text-base text-foreground block">تدريب حر ومرن</span>
                                    <span className="text-xs text-muted-foreground font-bold block mt-1 leading-relaxed">
                                        تخصيص كامل لعدد الأسئلة، تحديد مستوى الصعوبة، مع خيار إيقاف المؤقت.
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleModeChange('simulation')}
                                    className={cn(
                                        'p-5 rounded-2xl border-2 text-right transition-all duration-300 relative',
                                        mode === 'simulation'
                                            ? 'border-info bg-info/5 shadow-md scale-[1.01]'
                                            : 'border-border opacity-60 hover:opacity-100',
                                    )}
                                >
                                    <div className="w-10 h-10 bg-info/10 text-info rounded-xl flex items-center justify-center mb-3">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <span className="font-black text-base text-foreground block">اختبار محاكاة رسمي</span>
                                    <span className="text-xs text-muted-foreground font-bold block mt-1 leading-relaxed">
                                        خوض اختبارات المسابقات الرسمية الموزعة بمؤقت زمني صارم وشروط حقيقية.
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
                                <label className="block text-sm font-black text-foreground mb-2">
                                    اختر مسابقة رسمية من المسابقات المفعلة:
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {competitions.map((comp) => (
                                        <button
                                            key={comp.id}
                                            type="button"
                                            onClick={() => setSelectedComp(comp)}
                                            className={cn(
                                                'p-4 rounded-xl border text-right transition-all',
                                                selectedComp?.id === comp.id
                                                    ? 'border-info bg-info/10 text-info font-black'
                                                    : 'border-border bg-muted text-foreground hover:bg-muted/80',
                                            )}
                                        >
                                            <span className="text-sm block font-bold">{comp.name}</span>
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
