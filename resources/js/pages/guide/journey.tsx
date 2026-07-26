import { GuideRenderer } from '@/components/guide/guide-renderer';
import { guides } from '@/content';
import { parseGuideDocument } from '@/lib/guide-parser';

const document = parseGuideDocument(guides.journey);

export default function Journey() {
    return <GuideRenderer document={document} />;
}
