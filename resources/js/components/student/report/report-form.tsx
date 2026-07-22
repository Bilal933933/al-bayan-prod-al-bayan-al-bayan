import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import reportRoutes from '@/routes/student/report';
import { reportTypeMeta } from '@/types/report';
import type { ReportType } from '@/types/report';

interface RecentQuestion {
    id: number;
    text: string;
}

const typeOptions: { value: ReportType; emoji: string; label: string }[] = [
    { value: 'wrong_answer', emoji: '❌', label: 'خطأ في الإجابة' },
    { value: 'text_error', emoji: '✏️', label: 'مشكلة في النص' },
    { value: 'inappropriate_content', emoji: '🚫', label: 'محتوى غير مناسب' },
    { value: 'technical', emoji: '🐛', label: 'مشكلة تقنية' },
    { value: 'suggestion', emoji: '💡', label: 'اقتراح تحسين' },
    { value: 'other', emoji: '📝', label: 'أخرى' },
];

type Step = 'type' | 'details' | 'done';

interface ReportFormProps {
    recentQuestions?: RecentQuestion[];
}

export function ReportForm({ recentQuestions = [] }: ReportFormProps) {
    const [step, setStep] = useState<Step>('type');
    const [type, setType] = useState<ReportType | null>(null);
    const [questionId, setQuestionId] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showDropdown, setShowDropdown] = useState(false);

    const filteredQuestions = recentQuestions.filter((q) =>
        q.text.includes(searchQuery),
    );

    const selectedQuestion = recentQuestions.find((q) => q.id === Number(questionId));

    const handleSubmit = () => {
        if (!type || description.length < 10) {
            return;
        }

        setLoading(true);
        router.post(
            reportRoutes.store().url,
            {
                type,
                question_id: questionId ? Number(questionId) : null,
                description,
            },
            {
                onSuccess: () => {
                    toast.success('تم إرسال البلاغ بنجاح');
                    setStep('done');
                    setLoading(false);
                    setTimeout(() => window.location.reload(), 1500);
                },
                onError: (errors) => {
                    const messages = Object.values(errors);

                    if (messages.length > 0) {
                        toast.error(messages[0]);
                    }

                    setLoading(false);
                },
            },
        );
    };

    const handleReset = () => {
        setStep('type');
        setType(null);
        setQuestionId('');
        setDescription('');
    };

    if (step === 'done') {
        return null;
    }

    return (
        <div className="rounded-2xl border border-border bg-card p-5 shadow-xs">
            <div className="mb-5 flex items-center gap-2.5">
                <span className="text-xl">📋</span>
                <h2 className="text-sm font-bold">الإبلاغ عن مشكلة</h2>
            </div>

            {step === 'type' && (
                <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">اختر نوع المشكلة التي تواجهها:</p>
                    {typeOptions.map((opt) => (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
 setType(opt.value); setStep('details'); 
}}
                            className="flex w-full items-center gap-3 rounded-xl border-2 border-border bg-card p-3.5 text-right transition-all hover:border-primary hover:bg-primary/5"
                        >
                            <span className="text-xl">{opt.emoji}</span>
                            <span className="text-sm font-bold">{opt.label}</span>
                        </button>
                    ))}
                </div>
            )}

            {step === 'details' && type && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 rounded-xl bg-primary/5 p-3">
                        <span className="text-lg">{reportTypeMeta[type].emoji}</span>
                        <span className="text-sm font-bold">{reportTypeMeta[type].label}</span>
                        <button
                            type="button"
                            onClick={handleReset}
                            className="mr-auto text-xs text-muted-foreground underline"
                        >
                            تغيير
                        </button>
                    </div>

                    {recentQuestions.length > 0 && (
                        <div className="relative">
                            <label className="mb-1.5 block text-xs font-bold text-muted-foreground">
                                اختر السؤال <span className="text-xs font-normal">(اختياري)</span>
                            </label>
                            <div className="relative">
                                <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => {
 setSearchQuery(e.target.value); setShowDropdown(true); 
}}
                                    onFocus={() => setShowDropdown(true)}
                                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                                    placeholder="ابحث عن السؤال..."
                                    className="w-full rounded-xl border border-border bg-muted p-3 pr-10 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            {showDropdown && searchQuery && filteredQuestions.length > 0 && (
                                <div className="absolute z-20 mt-1 max-h-48 w-full overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
                                    {filteredQuestions.map((q) => (
                                        <button
                                            key={q.id}
                                            type="button"
                                            onMouseDown={() => {
 setQuestionId(String(q.id)); setSearchQuery(''); setShowDropdown(false); 
}}
                                            className={`block w-full px-3 py-2.5 text-right text-sm transition-colors hover:bg-muted ${Number(questionId) === q.id ? 'bg-primary/5 font-bold' : ''}`}
                                        >
                                            <span className="text-xs text-muted-foreground">#{q.id}</span>{' '}
                                            {q.text}
                                        </button>
                                    ))}
                                </div>
                            )}
                            {selectedQuestion && (
                                <div className="mt-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                                    <span className="text-xs text-muted-foreground">#{selectedQuestion.id}</span>{' '}
                                    {selectedQuestion.text}
                                </div>
                            )}
                        </div>
                    )}

                    <div>
                        <label className="mb-1.5 block text-xs font-bold text-muted-foreground">
                            وصف المشكلة <span className="text-destructive">*</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="اشرح المشكلة بالتفصيل..."
                            rows={4}
                            className="w-full resize-none rounded-xl border border-border bg-muted p-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                        <div className="mt-1 text-left text-xs text-muted-foreground">
                            {description.length} / 2000
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || description.length < 10}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:brightness-90 disabled:opacity-50 disabled:shadow-none"
                    >
                        {loading ? 'جاري الإرسال...' : 'إرسال البلاغ'}
                    </button>
                </div>
            )}
        </div>
    );
}
