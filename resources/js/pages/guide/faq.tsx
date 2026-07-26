import { GuideRenderer } from '@/components/guide/guide-renderer';
import { guides } from '@/content';
import { parseGuideDocument } from '@/lib/guide-parser';

const document = parseGuideDocument(guides.faq);

export default function FAQ() {
    return <GuideRenderer document={document} />;
}
