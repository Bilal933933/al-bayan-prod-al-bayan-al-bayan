import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ModeSelector  } from '@/components/student/attempts/mode-selector';
import type {AttemptMode} from '@/components/student/attempts/mode-selector';
import SimulationConfig from '@/components/student/attempts/simulation-config';
import TrainingConfig from '@/components/student/attempts/training-config';
import { dashboard } from '@/routes/student';
import type { BreadcrumbItem } from '@/types';
import type { Competition } from '@/types/competition';

interface CreateProps {
    topics: { id: number; name: string }[];
    competitions: (Competition & { children?: Competition[] })[];
}

export default function Create({ topics, competitions }: CreateProps) {
    const [mode, setMode] = useState<AttemptMode | null>(null);

    return (
        <>
            <Head title="إنشاء محاولة جديدة" />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mx-auto flex max-w-2xl flex-col items-center gap-6 p-6"
            >
                <div className="w-full text-center">
                    <h1 className="text-2xl font-bold">إنشاء محاولة جديدة</h1>
                    <p className="mt-1 text-muted-foreground">اختر نوع المحاولة التي تريد البدء بها</p>
                </div>

                {/* Mode Selector */}
                <div className="w-full">
                    <ModeSelector selected={mode} onChange={setMode} />
                </div>

                {/* Training Config */}
                {mode === 'training' && (
                    <div className="w-full">
                        <TrainingConfig
                            topics={topics}
                            hasInProgress={false}
                            onBack={() => setMode(null)}
                        />
                    </div>
                )}

                {/* Simulation Config */}
                {mode === 'simulation' && (
                    <div className="w-full">
                        <SimulationConfig
                            competitions={competitions}
                            onBack={() => setMode(null)}
                        />
                    </div>
                )}
            </motion.div>
        </>
    );
}

Create.layout = {
    breadcrumbs: [
        { title: 'لوحة التحكم', href: dashboard() },
        { title: 'إنشاء محاولة جديدة', href: '#' },
    ] satisfies BreadcrumbItem[],
};
