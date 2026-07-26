import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SummaryData {
    title?: string;
    topicName?: string;
    questionsCount?: number;
    withTimer?: boolean;
    durationMinutes?: number;
    difficulty?: string | null;
    sectionsCount?: number;
}

interface LiveSummaryCardProps {
    mode: 'training' | 'simulation' | null;
    data: SummaryData;
    onSubmit: () => void;
    loading: boolean;
}

function getDifficultyLabel(slug?: string | null): string {
    if (slug === 'easy') {
        return 'سهل';
    }

    if (slug === 'medium') {
        return 'متوسط';
    }

    if (slug === 'hard') {
        return 'صعب';
    }

    return 'جميع المستويات';
}

export default function LiveSummaryCard({
    mode,
    data,
    onSubmit,
    loading,
}: LiveSummaryCardProps) {
    return (
        <div
            className="sticky top-6 overflow-hidden rounded-3xl border border-border bg-card text-right shadow-lg"
            dir="rtl"
        >
            <div
                className={cn(
                    'flex items-center gap-3 p-5 font-bold text-primary-foreground transition-colors duration-300',
                    mode === 'simulation'
                        ? 'bg-info'
                        : mode === 'training'
                          ? 'bg-primary'
                          : 'bg-muted-foreground',
                )}
            >
                <Trophy className="h-5 w-5 text-warning" />
                <span>بطاقة مراجعة المحاولة الحية</span>
            </div>

            <div className="space-y-5 p-6">
                <AnimatePresence mode="wait">
                    {!mode ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="py-8 text-center text-sm font-medium text-muted-foreground"
                        >
                            يرجى اختيار نوع المحاولة من اليمين لبدء تجهيز ورقة
                            الأسئلة الذكية.
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-border pb-3">
                                <span className="text-xs font-bold text-muted-foreground">
                                    نوع المسار:
                                </span>
                                <span
                                    className={cn(
                                        'rounded-full px-2.5 py-1 text-xs font-black',
                                        mode === 'simulation'
                                            ? 'bg-info/10 text-info'
                                            : 'bg-primary/10 text-primary',
                                    )}
                                >
                                    {mode === 'simulation'
                                        ? 'اختبار محاكاة رسمي'
                                        : 'تدريب حر مرن'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between border-b border-border pb-3">
                                <span className="text-xs font-bold text-muted-foreground">
                                    المحتوى المستهدف:
                                </span>
                                <span className="text-sm font-bold text-foreground">
                                    {data.title || data.topicName || 'لم يحدد'}
                                </span>
                            </div>

                            <div className="my-2 grid grid-cols-2 gap-3 rounded-2xl bg-muted p-3">
                                <div className="text-center">
                                    <span className="block text-[10px] font-bold text-muted-foreground">
                                        إجمالي الأسئلة
                                    </span>
                                    <span className="mt-0.5 block text-base font-black text-foreground">
                                        {data.questionsCount || 0} أسئلة
                                    </span>
                                </div>
                                <div className="border-r border-border text-center">
                                    <span className="block text-[10px] font-bold text-muted-foreground">
                                        الوقت المخصص
                                    </span>
                                    <span className="mt-0.5 block text-base font-black text-foreground">
                                        {data.withTimer === false
                                            ? 'مفتوح'
                                            : `${data.durationMinutes || 0} دقيقة`}
                                    </span>
                                </div>
                            </div>

                            {mode === 'training' && (
                                <div className="flex items-center justify-between border-b border-border pb-3">
                                    <span className="text-xs font-bold text-muted-foreground">
                                        مستوى الصعوبة:
                                    </span>
                                    <span className="text-xs font-black text-foreground">
                                        {getDifficultyLabel(data.difficulty)}
                                    </span>
                                </div>
                            )}

                            {mode === 'simulation' && data.sectionsCount && (
                                <div className="flex items-center justify-between border-b border-border pb-3">
                                    <span className="text-xs font-bold text-muted-foreground">
                                        عدد الأقسام الفرعية:
                                    </span>
                                    <span className="text-xs font-black text-info">
                                        {data.sectionsCount} أقسام معرفية
                                    </span>
                                </div>
                            )}

                            <div className="relative my-4 border-t-2 border-dashed border-border">
                                <div className="absolute -top-2.5 -right-8 h-5 w-5 rounded-full bg-muted" />
                                <div className="absolute -top-2.5 -left-8 h-5 w-5 rounded-full bg-muted" />
                            </div>

                            {mode === 'simulation' && (
                                <div className="flex gap-2.5 rounded-xl border border-destructive/20 bg-destructive/10 p-3 text-right">
                                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                                    <p className="text-[11px] leading-relaxed font-bold text-destructive">
                                        بمجرد النقر، يبدأ المؤقت الإجباري.
                                        الخروج أو إغلاق الصفحة يحتسب محاولة
                                        مهجورة (Abandoned) فوراً.
                                    </p>
                                </div>
                            )}

                            <Button
                                onClick={onSubmit}
                                disabled={
                                    loading || (!data.title && !data.topicName)
                                }
                                className={cn(
                                    'w-full rounded-2xl py-6 text-base font-black text-primary-foreground shadow-lg transition-all',
                                    mode === 'simulation'
                                        ? 'bg-info hover:brightness-90'
                                        : 'bg-primary hover:brightness-90',
                                )}
                            >
                                {loading
                                    ? 'جاري تشييد الاختبار...'
                                    : 'تأكيد وبدء الاختبار الفوري'}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
