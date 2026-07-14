import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Head, router, usePage } from '@inertiajs/react';
import { dashboard } from '@/routes';
import competitions from '@/routes/admin/competitions';
import Heading from '@/components/heading';
import TopicLinkRow from '@/components/admin/competitions/topic-link-row';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import InputError from '@/components/input-error';
import { Save, Plus, BookOpen, Layers } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';
import type { Competition } from '@/types/competition';
import type { Topic, TopicWithPivot, CompetitionTopicPivot } from '@/types/topic';

interface TopicsProps {
    competition: Competition;
    attachedTopics: TopicWithPivot[];
    availableTopics: Topic[];
}

interface LinkedTopicEntry {
    topic_id: number;
    name: string;
    code: string;
    visibility: string;
    questions_count: number;
    duration_minutes: number;
    difficulty_distribution: Record<string, number> | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'المسابقات', href: competitions.index() },
    { title: 'المحاور', href: '#' },
];

export default function Topics({ competition, attachedTopics, availableTopics }: TopicsProps) {
    const [linkedTopics, setLinkedTopics] = useState<LinkedTopicEntry[]>(() =>
        attachedTopics.map((t) => ({
            topic_id: t.id,
            name: t.name,
            code: t.code,
            visibility: t.visibility,
            questions_count: t.pivot.questions_count,
            duration_minutes: t.pivot.duration_minutes,
            difficulty_distribution: t.pivot.difficulty_distribution,
        }))
    );

    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
    const [newQuestionsCount, setNewQuestionsCount] = useState(10);
    const [newDuration, setNewDuration] = useState(15);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { flash } = usePage<{ flash: { success?: string; error?: string } }>().props;

    const remainingTopics = availableTopics.filter(
        (t) => !linkedTopics.some((lt) => lt.topic_id === t.id)
    );

    useEffect(() => {
        if (flash?.success || flash?.error) {
            setErrors({});
        }
    }, [flash]);

    const addTopic = useCallback(() => {
        if (!selectedTopicId) return;
        const topic = availableTopics.find((t) => t.id === selectedTopicId);
        if (!topic) return;

        setLinkedTopics((prev) => [
            ...prev,
            {
                topic_id: topic.id,
                name: topic.name,
                code: topic.code,
                visibility: topic.visibility,
                questions_count: newQuestionsCount,
                duration_minutes: newDuration,
                difficulty_distribution: null,
            },
        ]);

        setSelectedTopicId(null);
        setNewQuestionsCount(10);
        setNewDuration(15);
    }, [selectedTopicId, availableTopics, newQuestionsCount, newDuration]);

    const removeTopic = useCallback((topicId: number) => {
        setLinkedTopics((prev) => prev.filter((t) => t.topic_id !== topicId));
    }, []);

    const updateTopic = useCallback((topicId: number, data: Partial<LinkedTopicEntry>) => {
        setLinkedTopics((prev) =>
            prev.map((t) => (t.topic_id === topicId ? { ...t, ...data } : t))
        );
    }, []);

    function handleSave() {
        setSaving(true);
        setErrors({});

        const payload = {
            topics: linkedTopics.map((t) => ({
                topic_id: t.topic_id,
                questions_count: t.questions_count,
                duration_minutes: t.duration_minutes,
                difficulty_distribution: t.difficulty_distribution,
            })),
        };

        router.put(competitions.topics.sync({ competition: competition.id }).url, payload, {
            onSuccess: () => {
                setSaving(false);
            },
            onError: (err) => {
                setErrors(err);
                setSaving(false);
            },
            preserveScroll: true,
        });
    }

    return (
        <>
            <Head title={`محاور: ${competition.name}`} />
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col gap-6 p-6"
            >
                <Heading
                    title={`محاور: ${competition.name}`}
                    description="إدارة المحاور المرتبطة بهذه المسابقة"
                />

                {flash?.success && (
                    <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                        {flash.success}
                    </div>
                )}

                {flash?.error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {flash.error}
                    </div>
                )}

                <InputError message={errors.topics} />

                {/* المحاور المرتبطة حالياً */}
                <div className="rounded-xl border">
                    <div className="flex items-center justify-between border-b bg-muted/60 px-4 py-3">
                        <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">
                                المحاور المرتبطة ({linkedTopics.length})
                            </span>
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={saving}
                            size="sm"
                        >
                            <Save className="h-4 w-4 ml-1" />
                            {saving ? 'جاري الحفظ...' : 'حفظ'}
                        </Button>
                    </div>

                    {linkedTopics.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                            <Layers className="h-8 w-8 text-muted-foreground/30" />
                            <p>لا توجد محاور مرتبطة بعد.</p>
                            <p className="text-xs">أضف محاور من القائمة أدناه</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-muted/30">
                                        <th className="px-4 py-2 text-start font-medium">المحور</th>
                                        <th className="px-4 py-2 text-start font-medium whitespace-nowrap">الكود</th>
                                        <th className="px-4 py-2 text-center font-medium whitespace-nowrap">عدد الأسئلة</th>
                                        <th className="px-4 py-2 text-center font-medium whitespace-nowrap">المدة (دق)</th>
                                        <th className="px-4 py-2 text-center font-medium whitespace-nowrap"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {linkedTopics.map((t, i) => (
                                        <TopicLinkRow
                                            key={t.topic_id}
                                            topic={{
                                                id: t.topic_id,
                                                name: t.name,
                                                code: t.code,
                                                visibility: t.visibility,
                                                pivot: {
                                                    questions_count: t.questions_count,
                                                    duration_minutes: t.duration_minutes,
                                                    difficulty_distribution: t.difficulty_distribution,
                                                },
                                            } as TopicWithPivot}
                                            index={i}
                                            onRemove={() => removeTopic(t.topic_id)}
                                            onChange={(data) => updateTopic(t.topic_id, data)}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* إضافة محور جديد */}
                {remainingTopics.length > 0 && (
                    <div className="rounded-xl border">
                        <div className="flex items-center gap-2 border-b bg-muted/60 px-4 py-3">
                            <BookOpen className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">إضافة محور</span>
                        </div>
                        <div className="flex flex-wrap items-end gap-4 p-4">
                            <div className="grid gap-1.5 min-w-48">
                                <Label className="text-xs">المحور</Label>
                                <select
                                    value={selectedTopicId ?? ''}
                                    onChange={(e) => setSelectedTopicId(e.target.value ? Number(e.target.value) : null)}
                                    className="border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm"
                                >
                                    <option value="">اختر محوراً...</option>
                                    {remainingTopics.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.name} ({t.visibility === 'general' ? 'عام' : 'خاص'})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs">عدد الأسئلة</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={newQuestionsCount}
                                    onChange={(e) => setNewQuestionsCount(Number(e.target.value))}
                                    className="h-9 w-20 text-center"
                                />
                            </div>

                            <div className="grid gap-1.5">
                                <Label className="text-xs">المدة (دق)</Label>
                                <Input
                                    type="number"
                                    min={1}
                                    value={newDuration}
                                    onChange={(e) => setNewDuration(Number(e.target.value))}
                                    className="h-9 w-20 text-center"
                                />
                            </div>

                            <Button
                                onClick={addTopic}
                                disabled={!selectedTopicId}
                                size="sm"
                                className="h-9"
                            >
                                <Plus className="h-4 w-4 ml-1" />
                                إضافة
                            </Button>
                        </div>
                    </div>
                )}

                {/* العودة */}
                <div className="flex justify-start">
                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                    >
                        العودة للمسابقة
                    </Button>
                </div>
            </motion.div>
        </>
    );
}

Topics.layout = {
    breadcrumbs,
};
