import { useState } from 'react';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { BookOpen, Play, ArrowRight, RotateCcw } from 'lucide-react';
import { DifficultySelector } from '@/components/student/topics/difficulty-selector';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import studentTopics from '@/routes/student/topics';

interface Topic {
    id: number;
    name: string;
}

interface TrainingConfigProps {
    topics: Topic[];
    hasInProgress: boolean;
    onBack: () => void;
}

export default function TrainingConfig({ topics, hasInProgress, onBack }: TrainingConfigProps) {
    const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
    const [difficulty, setDifficulty] = useState<string | null>(null);
    const [isStarting, setIsStarting] = useState(false);

    const selectedTopic = topics.find((t) => t.id === Number(selectedTopicId));
    const canStart = selectedTopicId !== null;

    function handleStart() {
        if (!canStart || isStarting) return;
        setIsStarting(true);

        const routeOptions = difficulty
            ? { query: { difficulty } }
            : undefined;

        const url = studentTopics.attempts.start(
            { topic: Number(selectedTopicId) },
            routeOptions,
        ).url;

        router.post(url, {}, { preserveScroll: true });
    }

    function handleResume() {
        if (!hasInProgress) return;
        router.visit('/attempts');
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
        >
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={onBack}
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                        >
                            <ArrowRight className="h-4 w-4" />
                        </button>
                        <div>
                            <h3 className="font-semibold">تدريب حر</h3>
                            <p className="text-sm text-muted-foreground">اختر المحور ومستوى الصعوبة للبدء</p>
                        </div>
                    </div>

                    <div className="mt-5 space-y-5">
                        {/* Topic Select */}
                        <div>
                            <label className="mb-2 block text-sm font-medium text-muted-foreground">المحور:</label>
                            <Select
                                value={selectedTopicId ?? undefined}
                                onValueChange={setSelectedTopicId}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="اختر المحور..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {topics.map((topic) => (
                                        <SelectItem key={topic.id} value={String(topic.id)}>
                                            {topic.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Difficulty - show after topic is selected */}
                        {selectedTopic && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                transition={{ duration: 0.2 }}
                            >
                                <DifficultySelector value={difficulty} onChange={setDifficulty} />
                            </motion.div>
                        )}

                        {/* Actions */}
                        <div className={cn('flex gap-3', hasInProgress && 'justify-between')}>
                            {hasInProgress && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleResume}
                                    className="gap-2"
                                >
                                    <RotateCcw className="h-4 w-4" />
                                    استئناف المحاولة
                                </Button>
                            )}
                            <Button
                                type="button"
                                onClick={handleStart}
                                disabled={!canStart || isStarting}
                                className={cn('gap-2', !hasInProgress && 'w-full sm:w-auto')}
                            >
                                <Play className="h-4 w-4" />
                                {isStarting ? 'جاري البدء...' : 'بدء التدريب'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
