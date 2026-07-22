import { router } from '@inertiajs/react';
import { MessageSquareText } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import reportRoutes from '@/routes/student/report';

interface ReportDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    questionId: number;
    questionText: string;
}

export function ReportDialog({ open, onOpenChange, questionId, questionText }: ReportDialogProps) {
    const [type, setType] = useState<string | null>(null);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        if (!type || description.length < 10) {
return;
}

        setLoading(true);
        router.post(
            reportRoutes.store().url,
            { type, question_id: questionId, description },
            {
                onSuccess: () => {
                    toast.success('تم إرسال البلاغ بنجاح');
                    onOpenChange(false);
                    setType(null);
                    setDescription('');
                    setLoading(false);
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

    const typeOptions = [
        { value: 'wrong_answer', emoji: '❌', label: 'خطأ في الإجابة' },
        { value: 'text_error', emoji: '✏️', label: 'مشكلة في النص' },
        { value: 'inappropriate_content', emoji: '🚫', label: 'محتوى غير مناسب' },
        { value: 'technical', emoji: '🐛', label: 'مشكلة تقنية' },
        { value: 'suggestion', emoji: '💡', label: 'اقتراح تحسين' },
        { value: 'other', emoji: '📝', label: 'أخرى' },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md" dir="rtl">
                <DialogHeader>
                    <DialogTitle>🚩 الإبلاغ عن مشكلة</DialogTitle>
                    <DialogDescription>
                        أبلغ عن مشكلة في هذا السؤال ليقوم فريق الدعم بمراجعتها.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="rounded-xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
                        {questionText.length > 150
                            ? `${questionText.slice(0, 150)}...`
                            : questionText}
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-bold text-muted-foreground">
                            نوع المشكلة <span className="text-destructive">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {typeOptions.map((opt) => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setType(opt.value)}
                                    className={`flex items-center gap-2 rounded-xl border-2 p-2.5 text-right text-xs font-bold transition-all ${
                                        type === opt.value
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border bg-card hover:border-primary'
                                    }`}
                                >
                                    <span>{opt.emoji}</span>
                                    <span>{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="mb-1.5 block text-xs font-bold text-muted-foreground">
                            وصف المشكلة <span className="text-destructive">*</span>
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="اشرح المشكلة بالتفصيل..."
                            rows={3}
                            className="w-full resize-none rounded-xl border border-border bg-muted p-3 text-sm text-foreground outline-none transition-all focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                        <div className="mt-1 text-left text-xs text-muted-foreground">
                            {description.length} / 2000
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={loading || !type || description.length < 10}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/30 transition-all hover:brightness-90 disabled:opacity-50 disabled:shadow-none"
                    >
                        <MessageSquareText className="h-4 w-4" />
                        {loading ? 'جاري الإرسال...' : 'إرسال البلاغ'}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
