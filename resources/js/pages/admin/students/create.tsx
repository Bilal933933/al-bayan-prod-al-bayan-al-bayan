import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import StudentForm from '@/components/admin/students/student-form';
import Heading from '@/components/heading';
import { dashboard } from '@/routes/admin';
import students from '@/routes/admin/students';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'الطلاب', href: students.index() },
    { title: 'إنشاء', href: students.create() },
];

interface CreateFormData {
    name: string;
    email: string;
    password: string;
    email_verified_at: string | null;
}

export default function Create() {
    const { data, setData, post, processing, errors } = useForm<CreateFormData>(
        {
            name: '',
            email: '',
            password: '',
            email_verified_at: null,
        },
    );

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(students.store().url);
    }

    return (
        <>
            <Head title="إنشاء طالب" />
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col gap-4 p-6"
            >
                <Heading title="إنشاء طالب" description="أضف طالباً جديداً" />
                <div className="max-w-2xl">
                    <StudentForm
                        data={data}
                        setData={setData}
                        processing={processing}
                        errors={errors}
                        onSubmit={submit}
                        submitLabel="إنشاء الطالب"
                    />
                </div>
            </motion.div>
        </>
    );
}

Create.layout = {
    breadcrumbs,
};
