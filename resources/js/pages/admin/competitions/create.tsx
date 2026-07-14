import { motion } from 'framer-motion';
import { Head, useForm } from '@inertiajs/react';
import { dashboard } from '@/routes';
import Heading from '@/components/heading';
import CompetitionForm from '@/components/admin/competitions/competition-form';
import competitions from '@/routes/admin/competitions';
import type { BreadcrumbItem } from '@/types';
import type { Competition, CompetitionFormData } from '@/types/competition';

interface CreateProps {
    availableParents: Pick<Competition, 'id' | 'name'>[];
    defaultParentId?: number | null;
}

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard() },
    { title: 'المسابقات', href: competitions.index() },
    { title: 'إنشاء', href: competitions.create() },
];

export default function Create({ availableParents, defaultParentId }: CreateProps) {
    const { data, setData, post, processing, errors } = useForm<CompetitionFormData>({
        parent_id: defaultParentId ?? null,
        classification: 'standalone',
        code: '',
        name: '',
        image: null,
        color: null,
        icon: null,
        description: null,
        is_active: true,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post(competitions.store().url);
    }

    return (
        <>
            <Head title="إنشاء مسابقة" />
            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col gap-4 p-6"
            >
                <Heading title="إنشاء مسابقة" description="أضف مسابقة جديدة" />
                <div className="max-w-2xl">
                    <CompetitionForm
                        data={data}
                        setData={setData}
                        processing={processing}
                        errors={errors}
                        onSubmit={submit}
                        submitLabel="إنشاء المسابقة"
                        availableParents={availableParents}
                    />
                </div>
            </motion.div>
        </>
    );
}

Create.layout = {
    breadcrumbs,
};
