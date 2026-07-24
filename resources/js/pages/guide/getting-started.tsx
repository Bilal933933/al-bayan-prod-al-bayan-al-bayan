import { GuideRenderer } from '@/components/guide/guide-renderer';
import { guides } from '@/content';
import { parseGuideDocument } from '@/lib/guide-parser';

const document = parseGuideDocument(guides['getting-started']);

export default function GettingStarted() {
    return <GuideRenderer document={document} />;
}