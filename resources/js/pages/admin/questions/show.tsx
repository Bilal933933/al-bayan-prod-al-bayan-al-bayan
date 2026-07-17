import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import QuestionExplanationCard from '@/components/admin/questions/question-explanation-card';
import QuestionInfoGrid from '@/components/admin/questions/question-info-grid';
import QuestionOptionsList from '@/components/admin/questions/question-options-list';
import DeleteDialog from '@/components/delete-dialog';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes/admin';
import questions from '@/routes/admin/questions';
import type { BreadcrumbItem } from '@/types';
import type { Question } from '@/types/question';

interface ShowProps {
    question: Question;
}

const TYPE_CONFIG: Record<string, { label: string; className: string }> = {
    mcq: { label: 'اختيار من متعدد', className: 'bg-info/20 text-info' },
    true_false: { label: 'صح/خطأ', className: 'bg-palette-3/20 text-palette-3' },
};

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'الأسئلة', href: questions.index() },
    { title: 'عرض', href: '#' },
];

export default function Show({ question }: ShowProps) {
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const typeConfig = TYPE_CONFIG[question.type] ?? { label: question.type, className: '' };

    function handleDelete() {
        setDeleting(true);
        router.delete(questions.destroy({ question: question.id }).url, {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteOpen(false);
            },
        });
    }

    return (
        <>
            <Head title={`عرض السؤال - ${question.text.length > 50 ? question.text.slice(0, 50) + '...' : question.text}`} />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col gap-6 p-6"
            >
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <Heading title="عرض السؤال" description={`${typeConfig.label} - ${question.topic?.name ?? 'بدون محور'}`} />
                    <div className="flex items-center gap-2">
                        <Link href={questions.edit({ question: question.id }).url}>
                            <Button variant="outline" size="sm">
                                <Pencil className="h-4 w-4" />
                                تعديل
                            </Button>
                        </Link>
                        <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
                            <Trash2 className="h-4 w-4" />
                            حذف
                        </Button>
                    </div>
                </div>

                <QuestionInfoGrid question={question} />

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">نص السؤال</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg leading-relaxed">{question.text}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">الخيارات</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <QuestionOptionsList options={question.options} />
                    </CardContent>
                </Card>

                {question.explanation && (
                    <QuestionExplanationCard explanation={question.explanation} />
                )}
            </motion.div>

            <DeleteDialog
                open={deleteOpen}
                onOpenChange={(open) => {
 if (!open) {
setDeleteOpen(false);
} 
}}
                description="هل أنت متأكد من حذف هذا السؤال؟ هذا الإجراء لا يمكن التراجع عنه."
                onDelete={handleDelete}
                processing={deleting}
            />
        </>
    );
}

Show.layout = {
    breadcrumbs,
};
