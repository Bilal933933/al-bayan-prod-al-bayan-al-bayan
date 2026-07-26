import type { RecentAttempt } from '@/types/dashboard';
import { AttemptRow } from './attempt-row';

interface AttemptListProps {
    attempts: RecentAttempt[];
}

export function AttemptList({ attempts }: AttemptListProps) {
    if (attempts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-sm text-muted-foreground">
                    لا توجد محاولات حديثة
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {attempts.map((attempt) => (
                <AttemptRow key={attempt.id} attempt={attempt} />
            ))}
        </div>
    );
}
