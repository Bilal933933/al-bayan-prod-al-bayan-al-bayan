import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import LiveSummaryCard from '@/components/student/attempts/live-summary-card';
import TrainingConfig from '@/components/student/attempts/training-config';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes/student';
import studentCompetitions from '@/routes/student/competitions';
import studentTopics from '@/routes/student/topics';
import type { Competition } from '@/types/competition';

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
    const [mode, setMode] = useState<'training' | 'simulation' | null>(null);
    const [loading, setLoading] = useState(false);

    const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
    const [difficulty, setDifficulty] = useState<string | null>(null);
    const [questionsCount, setQuestionsCount] = useState<number>(10);
    const [withTimer, setWithTimer] = useState<boolean>(true);

    const [selectedComp, setSelectedComp] = useState<Competition | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const topicId = params.get('topic');
        if (topicId && topics.find((t) => t.id === Number(topicId))) {
            handleTopicChange(Number(topicId));
            setMode('training');
        }
    }, []);

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
                questionsCount: 25,
                durationMinutes: 40,
                sectionsCount: 2,
            };
        }

        return {};
    }, [mode, selectedTopic, currentTopic, questionsCount, withTimer, difficulty, selectedComp]);

    const handleTopicChange = useCallback((id: number) => {
        setSelectedTopic(id);
        const topic = topics.find((t) => t.id === id);

        if (topic) {
            setQuestionsCount(topic.default_questions_count);
            setWithTimer(true);
        }
    }, [topics]);

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
                        <h1 className="text-2xl font-black text-slate-800">تجهيز محاولة جديدة</h1>
                        <p className="text-xs font-bold text-slate-400">
                            اختر أسلوب الاختبار والتحقق الذي يناسب خطتك الدراسية الحالية.
                        </p>
                    </div>
                    <Link
                        href={dashboard().url}
                        className="flex items-center gap-1.5 text-xs font-black text-slate-500 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-xl transition-all border border-slate-100"
                    >
                        <ArrowRight className="w-4 h-4" />
                        <span>رجوع للوحة التحكم</span>
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 items-start">
                    <div className="lg:col-span-6 space-y-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <div>
                            <label className="block text-sm font-black text-slate-700 mb-3">اختر مسار التقييم:</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => handleModeChange('training')}
                                    className={cn(
                                        'p-5 rounded-2xl border-2 text-right transition-all duration-300 relative',
                                        mode === 'training'
                                            ? 'border-blue-600 bg-blue-50/10 shadow-md scale-[1.01]'
                                            : 'border-slate-100 opacity-60 hover:opacity-100',
                                    )}
                                >
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
                                        <BookOpen className="w-5 h-5" />
                                    </div>
                                    <span className="font-black text-base text-slate-800 block">تدريب حر ومرن</span>
                                    <span className="text-xs text-slate-400 font-bold block mt-1 leading-relaxed">
                                        تخصيص كامل لعدد الأسئلة، تحديد مستوى الصعوبة، مع خيار إيقاف المؤقت.
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => handleModeChange('simulation')}
                                    className={cn(
                                        'p-5 rounded-2xl border-2 text-right transition-all duration-300 relative',
                                        mode === 'simulation'
                                            ? 'border-purple-600 bg-purple-50/10 shadow-md scale-[1.01]'
                                            : 'border-slate-100 opacity-60 hover:opacity-100',
                                    )}
                                >
                                    <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-3">
                                        <GraduationCap className="w-5 h-5" />
                                    </div>
                                    <span className="font-black text-base text-slate-800 block">اختبار محاكاة رسمي</span>
                                    <span className="text-xs text-slate-400 font-bold block mt-1 leading-relaxed">
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
                                <label className="block text-sm font-black text-slate-700 mb-2">
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
                                                    ? 'border-purple-600 bg-purple-50/30 text-purple-900 font-black'
                                                    : 'border-slate-100 bg-slate-50 text-slate-700 hover:bg-slate-100',
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
