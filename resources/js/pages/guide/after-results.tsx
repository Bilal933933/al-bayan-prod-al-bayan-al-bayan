import { GuideRenderer } from '@/components/guide/guide-renderer';
import { guides } from '@/content';
import { parseGuideDocument } from '@/lib/guide-parser';

const document = parseGuideDocument(guides['after-results']);

export default function AfterResults() {
    return <GuideRenderer document={document} />;
}