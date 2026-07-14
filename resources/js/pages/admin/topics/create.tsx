import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import TopicForm from '@/components/admin/topics/topic-form';
import Heading from '@/components/heading';
import { dashboard } from '@/routes';
import topics from '@/routes/admin/topics';
import type { BreadcrumbItem } from '@/types';
import type { TopicFormData } from '@/types/topic';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'المحاور', href: topics.index() },
    { title: 'إنشاء', href: topics.create() },
];

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<TopicFormData>({
        code: '',
        name: '',
        visibility: 'general',
        description: null,
        default_questions_count: 10,
        default_duration_minutes: null,
        is_active: true,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(topics.store().url);
    }

    return (
        <>
            <Head title="إنشاء محور" />
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col gap-4 p-6"
            >
                <Heading title="إنشاء محور" description="أضف محور اختبار جديد" />
                <div className="max-w-2xl">
                    <TopicForm
                        data={data}
                        setData={setData}
                        processing={processing}
                        errors={errors}
                        onSubmit={submit}
                        submitLabel="إنشاء المحور"
                    />
                </div>
            </motion.div>
        </>
    );
}

Create.layout = {
    breadcrumbs,
};
