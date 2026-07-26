import afterResultsMd from '@/../../content/after-results.md?raw';
import examDayMd from '@/../../content/exam-day.md?raw';
import examFormatMd from '@/../../content/exam-format.md?raw';
import faqMd from '@/../../content/faq.md?raw';
import gettingStartedMd from '@/../../content/getting-started.md?raw';
import journeyMd from '@/../../content/journey.md?raw';
import resourcesMd from '@/../../content/resources.md?raw';

export const guides = {
    journey: journeyMd,
    'exam-day': examDayMd,
    'exam-format': examFormatMd,
    'getting-started': gettingStartedMd,
    'after-results': afterResultsMd,
    faq: faqMd,
    resources: resourcesMd,
} as const;

export type GuideSlug = keyof typeof guides;
