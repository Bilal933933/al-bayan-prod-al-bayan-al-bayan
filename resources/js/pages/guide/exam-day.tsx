import { GuideRenderer } from '@/components/guide/guide-renderer';
import { guides } from '@/content';
import { parseGuideDocument } from '@/lib/guide-parser';

const document = parseGuideDocument(guides['exam-day']);

export default function ExamDay() {
    return <GuideRenderer document={document} />;
}
