import { Head } from '@inertiajs/react';
import { motion } from 'framer-motion';
import Heading from '@/components/heading';
import type { DashboardProps } from '@/types/dashboard';
import { CompMonitor } from './components/comp-monitor';
import { KpiGrid } from './components/kpi-grid';
import { LiveHub } from './components/live-hub';
import { QuickSidebar } from './components/quick-sidebar';
import { TopicAnalyzer } from './components/topic-analyzer';

const breadcrumbs = [{ title: 'لوحة التحكم', href: '#' }];

export default function Dashboard({
    stats,
    recentAttempts,
    topicPerformance,
    competitionsMonitor,
    systemHealthCount,
}: DashboardProps) {
    return (
        <>
            <Head title="لوحة التحكم والعمليات الحية" />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-1 flex-col gap-6 p-6"
                dir="rtl"
            >
                <Heading
                    title="نظرة تشغيلية عامة"
                    description="مراقبة حية لأداء الطلاب، استقرار المسابقات، وجودة بنك الأسئلة المعرفي"
                />

                <KpiGrid stats={stats} />

                <LiveHub
                    attempts={recentAttempts}
                    distribution={stats.questions.distribution}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <TopicAnalyzer data={topicPerformance} />
                    <CompMonitor data={competitionsMonitor} />
                    <QuickSidebar systemHealth={systemHealthCount} />
                </div>
            </motion.div>
        </>
    );
}

Dashboard.layout = { breadcrumbs };
