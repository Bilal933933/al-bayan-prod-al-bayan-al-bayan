import { motion } from 'framer-motion';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

export function GuideFeedback() {
    const [vote, setVote] = useState<'up' | 'down' | null>(null);
    const [reason, setReason] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl border bg-card p-6 text-center"
            >
                <p className="text-sm font-medium text-foreground">شكراً على ملاحظاتك! سنستخدمها لتحسين المحتوى.</p>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="rounded-xl border bg-card p-6"
        >
            <p className="mb-4 text-center text-sm font-medium text-foreground">هل كانت هذه الصفحة مفيدة؟</p>

            <div className="flex justify-center gap-4">
                <button
                    type="button"
                    onClick={() => setVote('up')}
                    className={cn(
                        'flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm transition-all',
                        vote === 'up'
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300'
                            : 'border-border hover:bg-accent',
                    )}
                >
                    <ThumbsUp className="size-4" />
                    نعم
                </button>
                <button
                    type="button"
                    onClick={() => setVote('down')}
                    className={cn(
                        'flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm transition-all',
                        vote === 'down'
                            ? 'border-red-300 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-950/30 dark:text-red-300'
                            : 'border-border hover:bg-accent',
                    )}
                >
                    <ThumbsDown className="size-4" />
                    لا
                </button>
            </div>

            {vote === 'down' && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 space-y-3 overflow-hidden"
                >
                    <p className="text-xs text-muted-foreground">ما الذي كان ينقصك؟</p>
                    <div className="flex flex-wrap gap-2">
                        {['معلومات أوفى', 'أمثلة تطبيقية', 'صور توضيحية', 'روابط أكثر', 'شيء آخر'].map((opt) => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => setReason(opt)}
                                className={cn(
                                    'rounded-lg border px-3 py-1.5 text-xs transition-all',
                                    reason === opt
                                        ? 'border-primary bg-primary/10 text-primary'
                                        : 'border-border hover:bg-accent',
                                )}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90"
                    >
                        إرسال
                    </button>
                </motion.div>
            )}

            {vote === 'up' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="mt-3 text-center"
                >
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-all hover:bg-primary/90"
                    >
                        إرسال
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
}