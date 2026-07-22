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
    { id: null, title: 'شامل الكل', desc: 'مزيج عشوائي', style: 'bg-muted/60 border-border text-foreground hover:bg-muted' },
    { id: 'easy', title: 'سهل', desc: 'أسئلة مباشرة', style: 'bg-success/10 border-success/20 text-success hover:bg-success/20' },
    { id: 'medium', title: 'متوسط', desc: 'تحتاج تركيز', style: 'bg-warning/10 border-warning/20 text-warning hover:bg-warning/20' },
    { id: 'hard', title: 'صعب', desc: 'مهارات عليا', style: 'bg-destructive/10 border-destructive/20 text-destructive hover:bg-destructive/20' },
];

const questionPresets = QUESTION_PRESETS;

export default function TrainingConfig({
    topics, selectedTopic, onTopicSelect,
    difficulty, onDifficultySelect,
    questionsCount, onQuestionsCountChange,
    withTimer, onTimerToggle,
}: TrainingConfigProps) {
    return (
        <div className="space-y-6 text-right">
            <div>
                <label className="block text-sm font-black text-foreground mb-2">اختر المحور المعرفي:</label>
                <select
                    value={selectedTopic ?? ''}
                    onChange={(e) => onTopicSelect(Number(e.target.value))}
                    className="w-full p-3.5 bg-muted border border-border rounded-xl font-bold text-foreground focus:outline-none focus:border-primary transition-colors text-sm"
                >
                    <option value="" disabled>-- اختر مادة للتدريب عليها --</option>
                    {topics.map((t) => (
                        <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
            </div>

            {selectedTopic && (
                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-muted/50 p-4 rounded-2xl border border-border"
                >
                    <div>
                        <label className="block text-xs font-black text-muted-foreground mb-2">عدد أسئلة التدريب:</label>
                        <div className="flex gap-2">
                            {questionPresets.map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => onQuestionsCountChange(num)}
                                    className={cn(
                                        'flex-1 py-2 rounded-lg font-black text-xs border transition-all',
                                        questionsCount === num
                                            ? 'bg-primary border-primary text-primary-foreground shadow-xs'
                                            : 'bg-card border-border text-muted-foreground hover:border-border',
                                    )}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-muted-foreground mb-2">مؤقت الضغط الزمني:</label>
                        <div className="flex bg-card p-1 rounded-xl border border-border">
                            <button
                                type="button"
                                onClick={() => onTimerToggle(true)}
                                className={cn(
                                    'flex-1 py-1.5 rounded-lg font-bold text-xs transition-all',
                                    withTimer ? 'bg-success/20 text-success font-black' : 'text-muted-foreground',
                                )}
                            >
                                تفعيل الوقت الافتراضي
                            </button>
                            <button
                                type="button"
                                onClick={() => onTimerToggle(false)}
                                className={cn(
                                    'flex-1 py-1.5 rounded-lg font-bold text-xs transition-all',
                                    !withTimer ? 'bg-warning/20 text-warning font-black' : 'text-muted-foreground',
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
                    <label className="block text-sm font-black text-foreground mb-2">مستوى الصعوبة المستهدف:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {difficultyOptions.map((card) => (
                            <button
                                key={card.id ?? 'all'}
                                type="button"
                                onClick={() => onDifficultySelect(card.id)}
                                className={cn(
                                    'p-3 rounded-2xl border text-right transition-all duration-200 relative overflow-hidden',
                                    card.style,
                                    difficulty === card.id && 'ring-2 ring-primary scale-[1.02]',
                                )}
                            >
                                <span className="font-black text-sm block">{card.title}</span>
                                <span className="text-[10px] text-muted-foreground font-medium block mt-0.5">{card.desc}</span>
                                {difficulty === card.id && (
                                    <span className="absolute top-2 left-2 bg-primary text-primary-foreground p-0.5 rounded-full">
                                        <Check className="w-3 h-3" />
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
