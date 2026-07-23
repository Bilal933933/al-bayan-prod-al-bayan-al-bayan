import { SlidingNumber } from '@/components/animate-ui/primitives/texts/sliding-number';

interface ScoreCircleProps {
    percentage: number;
}

function cssVar(name: string, fallback: string = ''): string {
    if (typeof window === 'undefined') {
return fallback;
}

    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
}

export default function ScoreCircle({ percentage }: ScoreCircleProps) {
    const radius = 48;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    const colorVar = percentage >= 70 ? 'var(--success)' : percentage >= 40 ? 'var(--warning)' : 'var(--destructive)';
    const trailColor = cssVar('--border', '#e2e8f0');

    return (
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
            <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
                <circle cx="64" cy="64" r={radius} fill="none" stroke={trailColor} strokeWidth={strokeWidth} />
                <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    fill="none"
                    stroke={colorVar}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-700 ease-out"
                    style={{ filter: `drop-shadow(0 0 6px color-mix(in oklab, ${colorVar} 25%, transparent))` }}
                />
            </svg>
            <span className="absolute text-3xl font-extrabold" style={{ color: colorVar }}>
                <SlidingNumber number={percentage} />%
            </span>
        </div>
    );
}
