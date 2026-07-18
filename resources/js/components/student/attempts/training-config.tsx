import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

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
    { id: null, title: 'شامل الكل', desc: 'مزيج عشوائي', style: 'bg-slate-50/60 border-slate-200 text-slate-700 hover:bg-slate-100' },
    { id: 'easy', title: 'سهل', desc: 'أسئلة مباشرة', style: 'bg-emerald-50/40 border-emerald-100 text-emerald-800 hover:bg-emerald-50' },
    { id: 'medium', title: 'متوسط', desc: 'تحتاج تركيز', style: 'bg-amber-50/40 border-amber-100 text-amber-800 hover:bg-amber-50' },
    { id: 'hard', title: 'صعب', desc: 'مهارات عليا', style: 'bg-rose-50/40 border-rose-100 text-rose-800 hover:bg-rose-50' },
];

const questionPresets = [10, 20, 30, 40];

export default function TrainingConfig({
    topics, selectedTopic, onTopicSelect,
    difficulty, onDifficultySelect,
    questionsCount, onQuestionsCountChange,
    withTimer, onTimerToggle,
}: TrainingConfigProps) {
    return (
        <div className="space-y-6 text-right">
            <div>
                <label className="block text-sm font-black text-slate-700 mb-2">اختر المحور المعرفي:</label>
                <select
                    value={selectedTopic ?? ''}
                    onChange={(e) => onTopicSelect(Number(e.target.value))}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 focus:outline-none focus:border-blue-500 transition-colors text-sm"
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
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50/50 p-4 rounded-2xl border border-slate-100"
                >
                    <div>
                        <label className="block text-xs font-black text-slate-500 mb-2">عدد أسئلة التدريب:</label>
                        <div className="flex gap-2">
                            {questionPresets.map((num) => (
                                <button
                                    key={num}
                                    type="button"
                                    onClick={() => onQuestionsCountChange(num)}
                                    className={cn(
                                        'flex-1 py-2 rounded-lg font-black text-xs border transition-all',
                                        questionsCount === num
                                            ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300',
                                    )}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-slate-500 mb-2">مؤقت الضغط الزمني:</label>
                        <div className="flex bg-white p-1 rounded-xl border border-slate-200">
                            <button
                                type="button"
                                onClick={() => onTimerToggle(true)}
                                className={cn(
                                    'flex-1 py-1.5 rounded-lg font-bold text-xs transition-all',
                                    withTimer ? 'bg-emerald-50 text-emerald-700 font-black' : 'text-slate-400',
                                )}
                            >
                                تفعيل الوقت الافتراضي
                            </button>
                            <button
                                type="button"
                                onClick={() => onTimerToggle(false)}
                                className={cn(
                                    'flex-1 py-1.5 rounded-lg font-bold text-xs transition-all',
                                    !withTimer ? 'bg-amber-50 text-amber-700 font-black' : 'text-slate-400',
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
                    <label className="block text-sm font-black text-slate-700 mb-2">مستوى الصعوبة المستهدف:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {difficultyOptions.map((card) => (
                            <button
                                key={card.id ?? 'all'}
                                type="button"
                                onClick={() => onDifficultySelect(card.id)}
                                className={cn(
                                    'p-3 rounded-2xl border text-right transition-all duration-200 relative overflow-hidden',
                                    card.style,
                                    difficulty === card.id && 'ring-2 ring-blue-600 scale-[1.02]',
                                )}
                            >
                                <span className="font-black text-sm block">{card.title}</span>
                                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{card.desc}</span>
                                {difficulty === card.id && (
                                    <span className="absolute top-2 left-2 bg-blue-600 text-white p-0.5 rounded-full">
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
