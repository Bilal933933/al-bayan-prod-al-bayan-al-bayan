import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const QUESTION_PRESETS = [10, 20, 30, 40];

interface Topic {
    id: number;
    name: string;
    default_questions_count: number;
    default_duration_minutes: number | null;
}

interface TrainingConfigProps {
    topics: Topic[];
    selectedTopic: number | null;
    onTopicSelect: (id: number) => void;
    difficulty: string | null;
    onDifficultySelect: (value: string | null) => void;
    questionsCount: number;
    onQuestionsCountChange: (count: number) => void;
    withTimer: boolean;
    onTimerToggle: (value: boolean) => void;
}

const difficultyOptions = [
    {
        id: null,
        title: 'شامل الكل',
        desc: 'مزيج عشوائي',
        style: 'bg-muted/60 border-border text-foreground hover:bg-muted',
    },
    {
        id: 'easy',
        title: 'سهل',
        desc: 'أسئلة مباشرة',
        style: 'bg-success/10 border-success/20 text-success hover:bg-success/20',
    },
    {
        id: 'medium',
        title: 'متوسط',
        desc: 'تحتاج تركيز',
        style: 'bg-warning/10 border-warning/20 text-warning hover:bg-warning/20',
    },
    {
        id: 'hard',
        title: 'صعب',
        desc: 'مهارات عليا',
        style: 'bg-destructive/10 border-destructive/20 text-destructive hover:bg-destructive/20',
    },
];

const questionPresets = QUESTION_PRESETS;

export default function TrainingConfig({
    topics,
    selectedTopic,
    onTopicSelect,
    difficulty,
    onDifficultySelect,
    questionsCount,
    onQuestionsCountChange,
    withTimer,
    onTimerToggle,
}: TrainingConfigProps) {
    return (
        <div className="space-y-6 text-right">
            <div>
                <label className="mb-2 block text-sm font-black text-foreground">
                    اختر المحور المعرفي:
                </label>
                <select
                    value={selectedTopic ?? ''}
                    onChange={(e) => onTopicSelect(Number(e.target.value))}
                    className="w-full rounded-xl border border-border bg-muted p-3.5 text-sm font-bold text-foreground transition-colors focus:border-primary focus:outline-none"
                >
                    <option value="" disabled>
                        -- اختر مادة للتدريب عليها --
                    </option>
                    {topics.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedTopic && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 gap-4 rounded-2xl border border-border bg-muted/50 p-4 md:grid-cols-2"
                >
                    <div>
                        <label className="mb-2 block text-xs font-black text-muted-foreground">
                            عدد أسئلة التدريب:
                        </label>
                        <div className="flex gap-2">
                            {questionPresets.map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => onQuestionsCountChange(num)}
                                    className={cn(
                                        'flex-1 rounded-lg border py-2 text-xs font-black transition-all',
                                        questionsCount === num
                                            ? 'border-primary bg-primary text-primary-foreground shadow-xs'
                                            : 'border-border bg-card text-muted-foreground hover:border-border',
                                    )}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-xs font-black text-muted-foreground">
                            مؤقت الضغط الزمني:
                        </label>
                        <div className="flex rounded-xl border border-border bg-card p-1">
                            <button
                                type="button"
                                onClick={() => onTimerToggle(true)}
                                className={cn(
                                    'flex-1 rounded-lg py-1.5 text-xs font-bold transition-all',
                                    withTimer
                                        ? 'bg-success/20 font-black text-success'
                                        : 'text-muted-foreground',
                                )}
                            >
                                تفعيل الوقت الافتراضي
                            </button>
                            <button
                                type="button"
                                onClick={() => onTimerToggle(false)}
                                className={cn(
                                    'flex-1 rounded-lg py-1.5 text-xs font-bold transition-all',
                                    !withTimer
                                        ? 'bg-warning/20 font-black text-warning'
                                        : 'text-muted-foreground',
                                )}
                            >
                                تدريب مفتوح (بدون وقت)
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {selectedTopic && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <label className="mb-2 block text-sm font-black text-foreground">
                        مستوى الصعوبة المستهدف:
                    </label>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {difficultyOptions.map((card) => (
                            <button
                                key={card.id ?? 'all'}
                                type="button"
                                onClick={() => onDifficultySelect(card.id)}
                                className={cn(
                                    'relative overflow-hidden rounded-2xl border p-3 text-right transition-all duration-200',
                                    card.style,
                                    difficulty === card.id &&
                                        'scale-[1.02] ring-2 ring-primary',
                                )}
                            >
                                <span className="block text-sm font-black">
                                    {card.title}
                                </span>
                                <span className="mt-0.5 block text-[10px] font-medium text-muted-foreground">
                                    {card.desc}
                                </span>
                                {difficulty === card.id && (
                                    <span className="absolute top-2 left-2 rounded-full bg-primary p-0.5 text-primary-foreground">
                                        <Check className="h-3 w-3" />
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
