import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import StudentForm from '@/components/admin/students/student-form';
import Heading from '@/components/heading';
import { dashboard } from '@/routes/admin';
import students from '@/routes/admin/students';
import type { BreadcrumbItem } from '@/types';
import type { User } from '@/types';

interface EditProps {
    student: User;
}

interface EditFormData {
    name: string;
    email: string;
    password: string;
    email_verified_at: string | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'الطلاب', href: students.index() },
    { title: 'تعديل', href: '#' },
];

export default function Edit({ student }: EditProps) {
    const { data, setData, put, processing, errors } = useForm<EditFormData>({
        name: student.name,
        email: student.email,
        password: '',
        email_verified_at: student.email_verified_at ?? null,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(students.update(student.id).url);
    }

    return (
        <>
            <Head title="تعديل طالب" />
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col gap-4 p-6"
            >
                <Heading title={`تعديل: ${student.name}`} description="تحديث بيانات الطالب" />
                <div className="max-w-2xl">
                    <StudentForm
                        data={data}
                        setData={setData}
                        processing={processing}
                        errors={errors}
                        onSubmit={submit}
                        submitLabel="حفظ التعديلات"
                        isEditing
                    />
                </div>
            </motion.div>
        </>
    );
}

Edit.layout = {
    breadcrumbs,
};
