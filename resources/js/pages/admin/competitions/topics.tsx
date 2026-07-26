import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Save, Plus, BookOpen, Layers, X } from 'lucide-react';
import { useState, useCallback } from 'react';
import TopicLinkRow from '@/components/admin/competitions/topic-link-row';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { dashboard } from '@/routes/admin';
import competitions from '@/routes/admin/competitions';
import type { BreadcrumbItem } from '@/types';
import type { Competition } from '@/types/competition';
import type { Topic, TopicWithPivot } from '@/types/topic';

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

export default function Topics({
    competition,
    attachedTopics,
    availableTopics,
}: TopicsProps) {
    const [linkedTopics, setLinkedTopics] = useState<LinkedTopicEntry[]>(() =>
        attachedTopics.map((t) => ({
            topic_id: t.id,
            name: t.name,
            code: t.code,
            visibility: t.visibility,
            questions_count: t.pivot.questions_count,
            duration_minutes: t.pivot.duration_minutes,
            difficulty_distribution: t.pivot.difficulty_distribution,
        })),
    );

    const [selectedTopicId, setSelectedTopicId] = useState<number | null>(null);
    const [newQuestionsCount, setNewQuestionsCount] = useState(10);
    const [newDuration, setNewDuration] = useState(15);
    const [showAddForm, setShowAddForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const remainingTopics = availableTopics.filter(
        (t) => !linkedTopics.some((lt) => lt.topic_id === t.id),
    );

    const addTopic = useCallback(() => {
        if (!selectedTopicId) {
            return;
        }

        const topic = availableTopics.find((t) => t.id === selectedTopicId);

        if (!topic) {
            return;
        }

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
        setShowAddForm(false);
    }, [selectedTopicId, availableTopics, newQuestionsCount, newDuration]);

    const removeTopic = useCallback((topicId: number) => {
        setLinkedTopics((prev) => prev.filter((t) => t.topic_id !== topicId));
    }, []);

    const updateTopic = useCallback(
        (topicId: number, data: Partial<LinkedTopicEntry>) => {
            setLinkedTopics((prev) =>
                prev.map((t) =>
                    t.topic_id === topicId ? { ...t, ...data } : t,
                ),
            );
        },
        [],
    );

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

        router.put(
            competitions.topics.sync({ competition: competition.slug }).url,
            payload,
            {
                onSuccess: () => {
                    setSaving(false);
                },
                onError: (err) => {
                    setErrors(err);
                    setSaving(false);
                },
                preserveScroll: true,
            },
        );
    }

    return (
        <>
            <Head title={`محاور: ${competition.name}`} />
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col gap-5 p-6"
            >
                <Heading
                    title={`محاور: ${competition.name}`}
                    description="إدارة المحاور المرتبطة بهذه المسابقة"
                />

                <InputError message={errors.topics} />

                {/* كارد واحد للمحاور */}
                <div className="flex flex-1 flex-col rounded-xl border">
                    {/* Header: title + إضافة محور + حفظ */}
                    <div className="flex flex-col gap-3 border-b bg-muted/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-2">
                            <Layers className="h-4 w-4 shrink-0 text-muted-foreground" />
                            <span className="text-xs font-medium md:text-sm">
                                المحاور المرتبطة ({linkedTopics.length})
                            </span>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                            {remainingTopics.length > 0 && (
                                <>
                                    {showAddForm ? (
                                        <div className="flex flex-wrap items-end gap-2">
                                            <div className="grid gap-0.5">
                                                <Label className="text-[10px] md:text-xs">
                                                    المحور
                                                </Label>
                                                <select
                                                    value={
                                                        selectedTopicId ?? ''
                                                    }
                                                    onChange={(e) =>
                                                        setSelectedTopicId(
                                                            e.target.value
                                                                ? Number(
                                                                      e.target
                                                                          .value,
                                                                  )
                                                                : null,
                                                        )
                                                    }
                                                    className="h-8 rounded-md border border-input bg-transparent px-2 text-xs shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm"
                                                >
                                                    <option value="">
                                                        اختر...
                                                    </option>
                                                    {remainingTopics.map(
                                                        (t) => (
                                                            <option
                                                                key={t.id}
                                                                value={t.id}
                                                            >
                                                                {t.name}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                            </div>
                                            <div className="grid gap-0.5">
                                                <Label className="text-[10px] md:text-xs">
                                                    أسئلة
                                                </Label>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={newQuestionsCount}
                                                    onChange={(e) =>
                                                        setNewQuestionsCount(
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className="h-8 w-14 text-center text-xs md:w-16 md:text-sm"
                                                />
                                            </div>
                                            <div className="grid gap-0.5">
                                                <Label className="text-[10px] md:text-xs">
                                                    دقائق
                                                </Label>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    value={newDuration}
                                                    onChange={(e) =>
                                                        setNewDuration(
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className="h-8 w-14 text-center text-xs md:w-16 md:text-sm"
                                                />
                                            </div>
                                            <Button
                                                onClick={addTopic}
                                                disabled={!selectedTopicId}
                                                size="sm"
                                                className="h-8 text-xs"
                                            >
                                                <Plus className="ms-1 h-3.5 w-3.5" />
                                                إضافة
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    setShowAddForm(false)
                                                }
                                                className="h-8 w-8"
                                            >
                                                <X className="h-3.5 w-3.5" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setShowAddForm(true)}
                                            className="h-8 text-xs"
                                        >
                                            <Plus className="ms-1 h-3.5 w-3.5" />
                                            إضافة محور
                                        </Button>
                                    )}
                                </>
                            )}

                            <Button
                                onClick={handleSave}
                                disabled={saving}
                                size="sm"
                                className="h-8 text-xs"
                            >
                                <Save className="ms-1 h-3.5 w-3.5" />
                                {saving ? 'جاري الحفظ...' : 'حفظ'}
                            </Button>
                        </div>
                    </div>

                    {/* الجدول مع max-height */}
                    {linkedTopics.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground">
                            <BookOpen className="h-8 w-8 text-muted-foreground/30" />
                            <p className="text-xs md:text-sm">
                                لا توجد محاور مرتبطة بعد.
                            </p>
                            <p className="text-xs text-muted-foreground/60">
                                اضفط على "إضافة محور" لربط أول محور
                            </p>
                        </div>
                    ) : (
                        <div className="max-h-[calc(100vh-18rem)] overflow-y-auto">
                            <table className="w-full text-xs md:text-sm">
                                <thead className="sticky top-0 z-10">
                                    <tr className="border-b bg-muted/80 backdrop-blur-sm">
                                        <th className="px-4 py-2 text-start font-medium">
                                            المحور
                                        </th>
                                        <th className="px-4 py-2 text-start font-medium whitespace-nowrap">
                                            الكود
                                        </th>
                                        <th className="px-4 py-2 text-center font-medium whitespace-nowrap">
                                            عدد الأسئلة
                                        </th>
                                        <th className="px-4 py-2 text-center font-medium whitespace-nowrap">
                                            المدة (دق)
                                        </th>
                                        <th className="px-4 py-2 text-center font-medium whitespace-nowrap"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {linkedTopics.map((t, i) => (
                                        <TopicLinkRow
                                            key={t.topic_id}
                                            topic={
                                                {
                                                    id: t.topic_id,
                                                    name: t.name,
                                                    code: t.code,
                                                    visibility: t.visibility,
                                                    pivot: {
                                                        questions_count:
                                                            t.questions_count,
                                                        duration_minutes:
                                                            t.duration_minutes,
                                                        difficulty_distribution:
                                                            t.difficulty_distribution,
                                                    },
                                                } as TopicWithPivot
                                            }
                                            index={i}
                                            onRemove={() =>
                                                removeTopic(t.topic_id)
                                            }
                                            onChange={(data) =>
                                                updateTopic(t.topic_id, data)
                                            }
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* العودة للمسابقة */}
                <div className="flex justify-start">
                    <Link
                        href={
                            competitions.show({ competition: competition.slug })
                                .url
                        }
                        className="shrink-0"
                    >
                        <Button variant="outline" size="sm">
                            العودة للمسابقة
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </>
    );
}

Topics.layout = {
    breadcrumbs,
};
