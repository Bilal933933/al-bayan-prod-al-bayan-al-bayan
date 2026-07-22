export interface ReportItem {
    id: number;
    type: ReportType;
    description: string;
    status: ReportStatus;
    user?: { id: number; name: string; email: string };
    question: { id: number; text: string } | null;
    created_at: string;
}

export type ReportType = 'wrong_answer' | 'text_error' | 'inappropriate_content' | 'technical' | 'suggestion' | 'other';

export type ReportStatus = 'pending' | 'reviewed' | 'resolved' | 'rejected';

export const reportTypeMeta: Record<ReportType, { label: string; emoji: string; color: string }> = {
    wrong_answer: { label: 'خطأ في الإجابة', emoji: '❌', color: 'text-destructive' },
    text_error: { label: 'مشكلة في النص', emoji: '✏️', color: 'text-warning' },
    inappropriate_content: { label: 'محتوى غير مناسب', emoji: '🚫', color: 'text-destructive' },
    technical: { label: 'مشكلة تقنية', emoji: '🐛', color: 'text-info' },
    suggestion: { label: 'اقتراح تحسين', emoji: '💡', color: 'text-accent' },
    other: { label: 'أخرى', emoji: '📝', color: 'text-muted-foreground' },
};

export const reportStatusMeta: Record<ReportStatus, { label: string; dotClass: string; bgClass: string }> = {
    pending: { label: 'قيد المراجعة', dotClass: 'bg-warning', bgClass: 'bg-warning/10 text-warning' },
    reviewed: { label: 'تمت المراجعة', dotClass: 'bg-info', bgClass: 'bg-info/10 text-info' },
    resolved: { label: 'تم العلاج', dotClass: 'bg-success', bgClass: 'bg-success/10 text-success' },
    rejected: { label: 'غير مقبول', dotClass: 'bg-destructive', bgClass: 'bg-destructive/10 text-destructive' },
};
