import { BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function QuestionExplanationCard({ explanation }: { explanation: string }) {
    return (
        <Card className="border-warning/30 bg-warning/5">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <BookOpen className="h-4 w-4 text-warning" />
                    شرح الإجابة
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="leading-relaxed text-warning">
                    {explanation}
                </p>
            </CardContent>
        </Card>
    );
}
