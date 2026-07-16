import { BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function QuestionExplanationCard({ explanation }: { explanation: string }) {
    return (
        <Card className="border-amber-200 bg-amber-50/30 dark:border-amber-800/30 dark:bg-amber-950/10">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="h-4 w-4 text-amber-600" />
                    شرح الإجابة
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="leading-relaxed text-amber-800 dark:text-amber-300">
                    {explanation}
                </p>
            </CardContent>
        </Card>
    );
}
