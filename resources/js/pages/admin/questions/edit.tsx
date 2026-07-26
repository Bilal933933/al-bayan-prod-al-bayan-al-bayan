import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import QuestionForm from '@/components/admin/questions/question-form';
import Heading from '@/components/heading';
import { dashboard } from '@/routes/admin';
import questions from '@/routes/admin/questions';
import type { BreadcrumbItem } from '@/types';
import type { Question, QuestionFormData } from '@/types/question';

interface EditProps {
    question: Question;
    topics: { id: number; name: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'الأسئلة', href: questions.index() },
    { title: 'تعديل', href: '#' },
];

export default function Edit({ question, topics }: EditProps) {
    const { data, setData, put, processing, errors } =
        useForm<QuestionFormData>({
            topic_id: question.topic_id,
            type: question.type,
            text: question.text,
            difficulty: question.difficulty,
            explanation: question.explanation,
            is_active: question.is_active,
            options: question.options?.map((opt) => ({
                text: opt.text,
                is_correct: opt.is_correct,
            })) ?? [
                { text: '', is_correct: false },
                { text: '', is_correct: false },
            ],
        });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(questions.update({ question: question.id }).url);
    }

    return (
        <>
            <Head title="تعديل سؤال" />
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col gap-4 p-6"
            >
                <Heading
                    title="تعديل السؤال"
                    description="تحديث بيانات السؤال"
                />
                <div className="max-w-2xl">
                    <QuestionForm
                        data={data}
                        setData={setData}
                        processing={processing}
                        errors={errors}
                        onSubmit={submit}
                        submitLabel="حفظ التعديلات"
                        topics={topics}
                    />
                </div>
            </motion.div>
        </>
    );
}

Edit.layout = {
    breadcrumbs,
};
