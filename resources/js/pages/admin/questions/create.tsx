import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import QuestionForm from '@/components/admin/questions/question-form';
import Heading from '@/components/heading';
import { dashboard } from '@/routes/admin';
import questions from '@/routes/admin/questions';
import type { BreadcrumbItem } from '@/types';
import type { QuestionFormData } from '@/types/question';

interface CreateProps {
    topics: { id: number; name: string }[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'الأسئلة', href: questions.index() },
    { title: 'إنشاء', href: questions.create() },
];

export default function Create({ topics }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm<QuestionFormData>({
        topic_id: '',
        type: 'mcq',
        text: '',
        difficulty: 'medium',
        explanation: null,
        is_active: true,
        options: [
            { text: '', is_correct: false },
            { text: '', is_correct: false },
        ],
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(questions.store().url);
    }

    return (
        <>
            <Head title="إنشاء سؤال" />
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col gap-4 p-6"
            >
                <Heading title="إنشاء سؤال" description="أضف سؤالاً جديداً" />
                <div className="max-w-2xl">
                    <QuestionForm
                        data={data}
                        setData={setData}
                        processing={processing}
                        errors={errors}
                        onSubmit={submit}
                        submitLabel="إنشاء السؤال"
                        topics={topics}
                    />
                </div>
            </motion.div>
        </>
    );
}

Create.layout = {
    breadcrumbs,
};
