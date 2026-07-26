import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import CompetitionForm from '@/components/admin/competitions/competition-form';
import Heading from '@/components/heading';
import { dashboard } from '@/routes/admin';
import competitions from '@/routes/admin/competitions';
import type { BreadcrumbItem } from '@/types';
import type { Competition, CompetitionFormData } from '@/types/competition';

interface EditProps {
    competition: Competition;
    availableParents: Pick<Competition, 'id' | 'name'>[];
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'المسابقات', href: competitions.index() },
    { title: 'تعديل', href: '#' },
];

export default function Edit({ competition, availableParents }: EditProps) {
    const { data, setData, put, processing, errors } =
        useForm<CompetitionFormData>({
            parent_id: competition.parent_id,
            classification: competition.classification,
            order: competition.order,
            code: competition.code,
            name: competition.name,
            slug: competition.slug,
            image: competition.image,
            color: competition.color,
            icon: competition.icon,
            description: competition.description,
            is_active: competition.is_active,
            start_date: competition.start_date ?? null,
            end_date: competition.end_date ?? null,
        });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        put(competitions.update(competition.slug).url);
    }

    return (
        <>
            <Head title="تعديل مسابقة" />
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col gap-4 p-6"
            >
                <Heading
                    title={`تعديل: ${competition.name}`}
                    description="تحديث بيانات المسابقة"
                />
                <div className="max-w-2xl">
                    <CompetitionForm
                        data={data}
                        setData={setData}
                        processing={processing}
                        errors={errors}
                        onSubmit={submit}
                        submitLabel="حفظ التعديلات"
                        availableParents={availableParents}
                    />
                </div>
            </motion.div>
        </>
    );
}

Edit.layout = {
    breadcrumbs,
};
