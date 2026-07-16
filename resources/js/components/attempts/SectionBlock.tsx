import { ChevronDown } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import QuestionCard from './QuestionCard';
import type { Attempt, AttemptSection } from '@/types/attempt';

interface SectionBlockProps {
    section: AttemptSection;
    attempt: Attempt;
    filter: string;
}

export default function SectionBlock({ section, attempt, filter }: SectionBlockProps) {
    const correctCount = section.questions.filter((q) => q.is_correct === true).length;
    const wrongCount = section.questions.filter((q) => q.is_correct === false).length;
    const unansweredCount = section.questions.filter((q) => q.is_correct === null).length;

    const filteredQuestions = section.questions.filter((q) => {
        if (filter === 'wrong') return q.is_correct === false;
        if (filter === 'unanswered') return q.is_correct === null;
        return true;
    });

    return (
        <Collapsible defaultOpen>
            <CollapsibleTrigger className="group flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-right shadow-sm transition-all hover:shadow-md">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <ChevronDown className="h-4 w-4 text-primary transition-transform group-data-[state=open]:rotate-180" />
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <span className="font-semibold">{section.topic?.name ?? `القسم ${section.order + 1}`}</span>
                        {section.submitted_at && (
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-600 ring-1 ring-emerald-200">
                                تم التسليم
                            </span>
                        )}
                        {filter !== 'all' && (
                            <span className="text-xs text-muted-foreground">
                                ({filteredQuestions.length} من {section.questions.length})
                            </span>
                        )}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs leading-relaxed">
                        <span className="text-slate-500">{section.questions.length} أسئلة</span>
                        <span className="text-slate-300" aria-hidden="true">•</span>
                        <span className="font-medium text-emerald-600">{correctCount} صحيح</span>
                        <span className="text-slate-300" aria-hidden="true">•</span>
                        <span className="font-medium text-rose-600">{wrongCount} خطأ</span>
                        {unansweredCount > 0 && (
                            <>
                                <span className="text-slate-300" aria-hidden="true">•</span>
                                <span className="font-medium text-slate-400">{unansweredCount} لم يُجب</span>
                            </>
                        )}
                    </div>
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 space-y-3">
                {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question) => (
                        <QuestionCard
                            key={question.id}
                            question={question}
                            attempt={attempt}
                            questionId={`question-${question.question_id}`}
                        />
                    ))
                ) : (
                    <p className="py-6 text-center text-sm text-slate-400">لا توجد أسئلة في هذا التصنيف</p>
                )}
            </CollapsibleContent>
        </Collapsible>
    );
}
