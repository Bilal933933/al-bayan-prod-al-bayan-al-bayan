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

export default function LiveSummaryCard({ mode, data, onSubmit, loading }: LiveSummaryCardProps) {
    return (
        <div className="sticky top-6 bg-card rounded-3xl border border-border shadow-lg overflow-hidden text-right" dir="rtl">
            <div className={cn(
                'p-5 text-primary-foreground font-bold flex items-center gap-3 transition-colors duration-300',
                mode === 'simulation' ? 'bg-info' : mode === 'training' ? 'bg-primary' : 'bg-muted-foreground',
            )}>
                <Trophy className="w-5 h-5 text-warning" />
                <span>بطاقة مراجعة المحاولة الحية</span>
            </div>

            <div className="p-6 space-y-5">
                <AnimatePresence mode="wait">
                    {!mode ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-8 text-muted-foreground font-medium text-sm"
                        >
                            يرجى اختيار نوع المحاولة من اليمين لبدء تجهيز ورقة الأسئلة الذكية.
                        </motion.div>
                    ) : (
                        <motion.div
                            key="content"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4"
                        >
                            <div className="flex justify-between items-center border-b border-border pb-3">
                                <span className="text-xs text-muted-foreground font-bold">نوع المسار:</span>
                                <span className={cn(
                                    'text-xs font-black px-2.5 py-1 rounded-full',
                                    mode === 'simulation' ? 'bg-info/10 text-info' : 'bg-primary/10 text-primary',
                                )}>
                                    {mode === 'simulation' ? 'اختبار محاكاة رسمي' : 'تدريب حر مرن'}
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-b border-border pb-3">
                                <span className="text-xs text-muted-foreground font-bold">المحتوى المستهدف:</span>
                                <span className="text-sm font-bold text-foreground">
                                    {data.title || data.topicName || 'لم يحدد'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 bg-muted p-3 rounded-2xl my-2">
                                <div className="text-center">
                                    <span className="text-[10px] text-muted-foreground block font-bold">إجمالي الأسئلة</span>
                                    <span className="text-base font-black text-foreground mt-0.5 block">
                                        {data.questionsCount || 0} أسئلة
                                    </span>
                                </div>
                                <div className="text-center border-r border-border">
                                    <span className="text-[10px] text-muted-foreground block font-bold">الوقت المخصص</span>
                                    <span className="text-base font-black text-foreground mt-0.5 block">
                                        {data.withTimer === false ? 'مفتوح' : `${data.durationMinutes || 0} دقيقة`}
                                    </span>
                                </div>
                            </div>

                            {mode === 'training' && (
                                <div className="flex justify-between items-center border-b border-border pb-3">
                                    <span className="text-xs text-muted-foreground font-bold">مستوى الصعوبة:</span>
                                    <span className="text-xs font-black text-foreground">
                                        {getDifficultyLabel(data.difficulty)}
                                    </span>
                                </div>
                            )}

                            {mode === 'simulation' && data.sectionsCount && (
                                <div className="flex justify-between items-center border-b border-border pb-3">
                                    <span className="text-xs text-muted-foreground font-bold">عدد الأقسام الفرعية:</span>
                                    <span className="text-xs font-black text-info">{data.sectionsCount} أقسام معرفية</span>
                                </div>
                            )}

                            <div className="border-t-2 border-dashed border-border my-4 relative">
                                <div className="absolute -top-2.5 -right-8 w-5 h-5 bg-muted rounded-full" />
                                <div className="absolute -top-2.5 -left-8 w-5 h-5 bg-muted rounded-full" />
                            </div>

                            {mode === 'simulation' && (
                                <div className="p-3 bg-destructive/10 rounded-xl border border-destructive/20 flex gap-2.5 text-right">
                                    <AlertTriangle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-destructive font-bold leading-relaxed">
                                        بمجرد النقر، يبدأ المؤقت الإجباري. الخروج أو إغلاق الصفحة يحتسب محاولة مهجورة (Abandoned) فوراً.
                                    </p>
                                </div>
                            )}

                            <Button
                                onClick={onSubmit}
                                disabled={loading || (!data.title && !data.topicName)}
                                className={cn(
                                    'w-full py-6 text-primary-foreground font-black text-base rounded-2xl shadow-lg transition-all',
                                    mode === 'simulation'
                                        ? 'bg-info hover:brightness-90'
                                        : 'bg-primary hover:brightness-90',
                                )}
                            >
                                {loading ? 'جاري تشييد الاختبار...' : 'تأكيد وبدء الاختبار الفوري'}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
