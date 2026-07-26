import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ChildrenList from '@/components/student/competitions/join/children-list';
import JoinActions from '@/components/student/competitions/join/join-actions';
import JoinHero from '@/components/student/competitions/join/join-hero';
import PerksList from '@/components/student/competitions/join/perks-list';
import StatCards from '@/components/student/competitions/join/stat-cards';
import competitions from '@/routes/student/competitions';
import type { Competition, ChildCompetition } from '@/types/competition';

interface JoinProps {
    competition: Competition & {
        users_count?: number;
        topics_count?: number;
        children?: ChildCompetition[];
    };
    is_joined: boolean;
    total_questions: number;
}

export default function Join({
    competition,
    is_joined,
    total_questions,
}: JoinProps) {
    return (
        <>
            <Head title={`الانضمام إلى ${competition.name}`} />

            <div className="mx-auto max-w-4xl px-4 py-8" dir="rtl">
                <Link
                    href={competitions.index.url()}
                    className="mb-6 flex w-fit items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-800"
                >
                    <ArrowRight className="h-4 w-4" />
                    <span>العودة للمسابقات</span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-100/50"
                >
                    <JoinHero competition={competition} />

                    <div className="p-8">
                        <StatCards
                            totalQuestions={total_questions}
                            topicsCount={competition.topics_count ?? 0}
                            usersCount={competition.users_count ?? 0}
                        />

                        <PerksList />

                        {competition.children &&
                            competition.children.length > 0 && (
                                <ChildrenList children={competition.children} />
                            )}

                        <div className="pt-4">
                            <JoinActions
                                competition={competition}
                                isJoined={is_joined}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </>
    );
}
