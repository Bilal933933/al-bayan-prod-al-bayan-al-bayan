import { Award, BookOpen, Calendar, Eye, FileQuestion } from 'lucide-react';
import DifficultyBadge from '@/components/admin/questions/difficulty-badge';
import DateDisplay from '@/components/date-display';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Question } from '@/types/question';

const TYPE_CONFIG: Record<string, { label: string; className: string }> = {
    mcq: { label: 'اختيار من متعدد', className: 'bg-info/20 text-info' },
    true_false: {
        label: 'صح/خطأ',
        className: 'bg-palette-3/20 text-palette-3',
    },
};

export default function QuestionInfoGrid({ question }: { question: Question }) {
    const typeConfig = TYPE_CONFIG[question.type] ?? {
        label: question.type,
        className: '',
    };

    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            المحور
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-base font-semibold">
                            {question.topic?.name ?? '—'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <FileQuestion className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            النوع
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge
                            variant="secondary"
                            className={typeConfig.className}
                        >
                            {typeConfig.label}
                        </Badge>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <Award className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            المستوى
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <DifficultyBadge difficulty={question.difficulty} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center gap-2 pb-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            الحالة
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Badge
                            variant={
                                question.is_active ? 'default' : 'secondary'
                            }
                        >
                            {question.is_active ? 'نشط' : 'غير نشط'}
                        </Badge>
                    </CardContent>
                </Card>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    تاريخ الإنشاء:{' '}
                    <DateDisplay date={question.created_at} format="full" />
                </span>
                <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    آخر تحديث:{' '}
                    <DateDisplay date={question.updated_at} format="full" />
                </span>
            </div>
        </>
    );
}
