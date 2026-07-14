import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import TopicForm from '@/components/admin/topics/topic-form';
import Heading from '@/components/heading';
import { dashboard } from '@/routes';
import topics from '@/routes/admin/topics';
import type { BreadcrumbItem } from '@/types';
import type { Topic, TopicFormData } from '@/types/topic';

interface EditProps {
    topic: Topic;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'المحاور', href: topics.index() },
    { title: 'تعديل', href: '#' },
];

export default function Edit({ topic }: EditProps) {
    const { data, setData, put, processing, errors } = useForm<TopicFormData>({
        code: topic.code,
        name: topic.name,
        visibility: topic.visibility,
        description: topic.description,
        default_questions_count: topic.default_questions_count,
        default_duration_minutes: topic.default_duration_minutes,
        is_active: topic.is_active,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(topics.update(topic.id).url);
    }

    return (
        <>
            <Head title="تعديل محور" />
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col gap-4 p-6"
            >
                <Heading
                    title={`تعديل: ${topic.name}`}
                    description="تحديث بيانات المحور"
                />
                <div className="max-w-2xl">
                    <TopicForm
                        data={data}
                        setData={setData}
                        processing={processing}
                        errors={errors}
                        onSubmit={submit}
                        submitLabel="حفظ التعديلات"
                    />
                </div>
            </motion.div>
        </>
    );
}

Edit.layout = {
    breadcrumbs,
};
