import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function PreviewBadge() {
    return (
        <Badge
            variant="outline"
            className="gap-1.5 border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800 dark:bg-sky-950 dark:text-sky-300"
        >
            <Sparkles className="h-3 w-3" />
            معاينة — هكذا ستبدو تجربتك بعد أول اختبار
        </Badge>
    );
}
