import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { Play, ArrowRight, ChevronLeft, FolderOpen, Trophy } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { start as startExam } from '@/routes/student/competitions/attempts';
import type { Competition } from '@/types/competition';

type CompetitionWithChildren = Competition & { children?: CompetitionWithChildren[] };

interface SimulationConfigProps {
    competitions: CompetitionWithChildren[];
    onBack: () => void;
}

export default function SimulationConfig({ competitions, onBack }: SimulationConfigProps) {
    const [selectedParent, setSelectedParent] = useState<CompetitionWithChildren | null>(null);
    const [selectedCompetition, setSelectedCompetition] = useState<CompetitionWithChildren | null>(null);
    const [isStarting, setIsStarting] = useState(false);

    function handleSelectCompetition(competition: CompetitionWithChildren) {
        if (competition.classification === 'container') {
            setSelectedParent(competition);
            setSelectedCompetition(null);
        } else {
            setSelectedCompetition(competition);
        }
    }

    function handleStart() {
        if (!selectedCompetition || isStarting) {
            return;
        }

        setIsStarting(true);

        router.post(startExam.url({ competition: selectedCompetition.id }), {}, {
            preserveScroll: true,
        });
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
        >
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={
                                selectedParent
                                    ? () => {
                                        setSelectedParent(null);
                                        setSelectedCompetition(null);
                                    }
                                    : onBack
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                        >
                            <ArrowRight className="h-4 w-4" />
                        </button>
                        <div>
                            <h3 className="font-semibold">اختبار محاكاة</h3>
                            <p className="text-sm text-muted-foreground">
                                {selectedParent
                                    ? `اختر مسابقة من "${selectedParent.name}"`
                                    : 'اختر المسابقة للمشاركة'
                                }
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 space-y-3">
                        {/* Breadcrumb when inside container */}
                        {selectedParent && (
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedParent(null);
                                        setSelectedCompetition(null);
                                    }}
                                    className="hover:text-foreground transition-colors"
                                >
                                    جميع المسابقات
                                </button>
                                <ChevronLeft className="h-3.5 w-3.5" />
                                <span className="font-medium text-foreground">{selectedParent.name}</span>
                            </div>
                        )}

                        {/* Competition list */}
                        <div className="grid gap-3 sm:grid-cols-2">
                            {(selectedParent ? selectedParent.children : competitions)?.map((competition) => (
                                <button
                                    key={competition.id}
                                    type="button"
                                    onClick={() => handleSelectCompetition(competition)}
                                    className={cn(
                                        'flex items-center gap-3 rounded-xl border-2 p-4 text-right transition-all duration-200',
                                        selectedCompetition?.id === competition.id
                                            ? 'border-info bg-info/10 dark:bg-info/10 dark:border-info'
                                            : 'border-muted bg-card hover:border-muted-foreground/25',
                                    )}
                                >
                                    <div className={cn(
                                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                                        selectedCompetition?.id === competition.id
                                            ? 'bg-info/20 dark:bg-info/20 text-info dark:text-info'
                                            : 'bg-muted text-muted-foreground',
                                    )}>
                                        {competition.classification === 'container'
                                            ? <FolderOpen className="h-5 w-5" />
                                            : <Trophy className="h-5 w-5" />
                                        }
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium truncate">{competition.name}</p>
                                        {competition.classification === 'container' && competition.children && (
                                            <p className="text-xs text-muted-foreground mt-0.5">
                                                {competition.children.length} مسابقة فرعية
                                            </p>
                                        )}
                                    </div>
                                    {competition.classification === 'container' && (
                                        <ChevronLeft className="mr-auto h-4 w-4 text-muted-foreground shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {competitions.length === 0 && (
                            <p className="py-8 text-center text-sm text-muted-foreground">
                                لا توجد مسابقات متاحة حالياً
                            </p>
                        )}

                        {/* Start button */}
                        {selectedCompetition && (
                            <motion.div
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex justify-center pt-2"
                            >
                                <Button
                                    type="button"
                                    onClick={handleStart}
                                    disabled={isStarting}
                                    size="lg"
                                    className="gap-2 text-base"
                                >
                                    <Play className="h-5 w-5" />
                                    {isStarting ? 'جارٍ إنشاء الاختبار...' : 'ابدأ اختبار المحاكاة'}
                                </Button>
                            </motion.div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
