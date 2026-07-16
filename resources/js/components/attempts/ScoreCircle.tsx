interface ScoreCircleProps {
    percentage: number;
}

export default function ScoreCircle({ percentage }: ScoreCircleProps) {
    const radius = 48;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;
    const color = percentage >= 70 ? '#10b981' : percentage >= 40 ? '#f59e0b' : '#ef4444';

    return (
        <div className="relative flex h-32 w-32 shrink-0 items-center justify-center">
            <svg className="h-32 w-32 -rotate-90" viewBox="0 0 128 128" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
                <circle cx="64" cy="64" r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} />
                <circle
                    cx="64"
                    cy="64"
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    className="transition-all duration-700 ease-out"
                    style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
                />
            </svg>
            <span className="absolute text-3xl font-extrabold" style={{ color }}>
                {percentage}%
            </span>
        </div>
    );
}
