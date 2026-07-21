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
        <div className="sticky top-6 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden text-right" dir="rtl">
            <div className={cn(
                'p-5 text-white font-bold flex items-center gap-3 transition-colors duration-300',
                mode === 'simulation' ? 'bg-purple-600' : mode === 'training' ? 'bg-blue-600' : 'bg-slate-400',
            )}>
                <Trophy className="w-5 h-5 text-amber-300" />
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
                            className="text-center py-8 text-slate-400 font-medium text-sm"
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
                            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                                <span className="text-xs text-slate-400 font-bold">نوع المسار:</span>
                                <span className={cn(
                                    'text-xs font-black px-2.5 py-1 rounded-full',
                                    mode === 'simulation' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700',
                                )}>
                                    {mode === 'simulation' ? 'اختبار محاكاة رسمي' : 'تدريب حر مرن'}
                                </span>
                            </div>

                            <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                                <span className="text-xs text-slate-400 font-bold">المحتوى المستهدف:</span>
                                <span className="text-sm font-bold text-slate-700">
                                    {data.title || data.topicName || 'لم يحدد'}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl my-2">
                                <div className="text-center">
                                    <span className="text-[10px] text-slate-400 block font-bold">إجمالي الأسئلة</span>
                                    <span className="text-base font-black text-slate-700 mt-0.5 block">
                                        {data.questionsCount || 0} أسئلة
                                    </span>
                                </div>
                                <div className="text-center border-r border-slate-200">
                                    <span className="text-[10px] text-slate-400 block font-bold">الوقت المخصص</span>
                                    <span className="text-base font-black text-slate-700 mt-0.5 block">
                                        {data.withTimer === false ? 'مفتوح' : `${data.durationMinutes || 0} دقيقة`}
                                    </span>
                                </div>
                            </div>

                            {mode === 'training' && (
                                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                                    <span className="text-xs text-slate-400 font-bold">مستوى الصعوبة:</span>
                                    <span className="text-xs font-black text-slate-700">
                                        {getDifficultyLabel(data.difficulty)}
                                    </span>
                                </div>
                            )}

                            {mode === 'simulation' && data.sectionsCount && (
                                <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                                    <span className="text-xs text-slate-400 font-bold">عدد الأقسام الفرعية:</span>
                                    <span className="text-xs font-black text-purple-700">{data.sectionsCount} أقسام معرفية</span>
                                </div>
                            )}

                            <div className="border-t-2 border-dashed border-slate-200 my-4 relative">
                                <div className="absolute -top-2.5 -right-8 w-5 h-5 bg-slate-50 rounded-full" />
                                <div className="absolute -top-2.5 -left-8 w-5 h-5 bg-slate-50 rounded-full" />
                            </div>

                            {mode === 'simulation' && (
                                <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex gap-2.5 text-right">
                                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                    <p className="text-[11px] text-rose-700 font-bold leading-relaxed">
                                        بمجرد النقر، يبدأ المؤقت الإجباري. الخروج أو إغلاق الصفحة يحتسب محاولة مهجورة (Abandoned) فوراً.
                                    </p>
                                </div>
                            )}

                            <Button
                                onClick={onSubmit}
                                disabled={loading || (!data.title && !data.topicName)}
                                className={cn(
                                    'w-full py-6 text-white font-black text-base rounded-2xl shadow-lg transition-all',
                                    mode === 'simulation'
                                        ? 'bg-purple-600 hover:bg-purple-700 shadow-purple-600/15'
                                        : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/15',
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
