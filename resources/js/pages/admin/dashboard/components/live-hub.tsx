import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RecentAttempt } from '@/types/dashboard';
import { AttemptList } from './attempt-list';
import { DifficultyChart } from './difficulty-chart';

interface LiveHubProps {
    attempts: RecentAttempt[];
    distribution: {
        easy: number;
        medium: number;
        hard: number;
    };
}

export function LiveHub({ attempts, distribution }: LiveHubProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="text-base">آخر المحاولات الحية</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AttemptList attempts={attempts} />
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-5">
                <Card className="h-full">
                    <CardHeader>
                        <CardTitle className="text-base">توزيع صعوبة الأسئلة</CardTitle>
                    </CardHeader>
                    <CardContent className="flex items-center justify-center">
                        <DifficultyChart distribution={distribution} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
