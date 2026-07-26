import { useState } from 'react';

interface ChartData {
    percentage: number;
    type: string;
}

const Y_TICKS = [0, 20, 40, 60, 80, 100];
const MARGIN = { top: 22, right: 30, bottom: 28, left: 8 };

function cssVar(name: string): string {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(name)
        .trim();
}

export function RechartsBar({
    data,
    height = 240,
}: {
    data: ChartData[];
    height?: number;
}) {
    const [colors] = useState(() => ({
        practice: cssVar('--info') || '#60a5fa',
        exam: cssVar('--warning') || '#fb923c',
    }));

    const { practice: practiceColor, exam: examColor } = colors;
    const pointCount = data.length;
    const w = Math.max(300, pointCount * 56);
    const chartW = w - MARGIN.left - MARGIN.right;
    const chartH = height - MARGIN.top - MARGIN.bottom;

    const points = data.map((d, i) => ({
        x: MARGIN.left + (i / Math.max(pointCount - 1, 1)) * chartW,
        y: MARGIN.top + chartH - (d.percentage / 100) * chartH,
        ...d,
    }));

    const practicePoints = points.filter((p) => p.type !== 'exam');
    const examPoints = points.filter((p) => p.type === 'exam');

    return (
        <svg
            width="100%"
            height={height}
            viewBox={`0 0 ${w} ${height}`}
            preserveAspectRatio="xMidYMid meet"
        >
            {/* Grid lines + Y-axis labels */}
            {Y_TICKS.map((tick) => {
                const y = MARGIN.top + chartH - (tick / 100) * chartH;

                return (
                    <g key={tick}>
                        <line
                            x1={MARGIN.left}
                            y1={y}
                            x2={MARGIN.left + chartW}
                            y2={y}
                            stroke="currentColor"
                            strokeOpacity={0.08}
                            strokeDasharray="3 3"
                        />
                        <text
                            x={MARGIN.left + chartW + 4}
                            y={y + 3}
                            textAnchor="start"
                            fontSize={10}
                            className="fill-muted-foreground/60"
                        >
                            {tick}%
                        </text>
                    </g>
                );
            })}

            {/* X-axis labels */}
            {points.map((p, i) => (
                <text
                    key={`x-${i}`}
                    x={p.x}
                    y={height - MARGIN.bottom + 12}
                    textAnchor="middle"
                    fontSize={10}
                    className="fill-muted-foreground/60"
                >
                    {i + 1}
                </text>
            ))}
            <text
                x={MARGIN.left + chartW / 2}
                y={height - 4}
                textAnchor="middle"
                fontSize={9}
                className="fill-muted-foreground/40"
            >
                المحاولة
            </text>

            {/* Gradients */}
            <defs>
                <linearGradient id="areaPractice" x1="0" y1="0" x2="0" y2="1">
                    <stop
                        offset="0%"
                        stopColor={practiceColor}
                        stopOpacity={0.08}
                    />
                    <stop
                        offset="100%"
                        stopColor={practiceColor}
                        stopOpacity={0.005}
                    />
                </linearGradient>
                <linearGradient id="areaExam" x1="0" y1="0" x2="0" y2="1">
                    <stop
                        offset="0%"
                        stopColor={examColor}
                        stopOpacity={0.08}
                    />
                    <stop
                        offset="100%"
                        stopColor={examColor}
                        stopOpacity={0.01}
                    />
                </linearGradient>
            </defs>

            {/* Practice area */}
            {practicePoints.length > 1 && (
                <polygon
                    points={`${practicePoints[0].x},${MARGIN.top + chartH} ${practicePoints.map((p) => `${p.x},${p.y}`).join(' ')} ${practicePoints[practicePoints.length - 1].x},${MARGIN.top + chartH}`}
                    fill="url(#areaPractice)"
                />
            )}

            {/* Practice line */}
            {practicePoints.length > 1 && (
                <polyline
                    points={practicePoints
                        .map((p) => `${p.x},${p.y}`)
                        .join(' ')}
                    fill="none"
                    stroke={practiceColor}
                    strokeWidth={2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            )}

            {/* Exam area */}
            {examPoints.length > 1 && (
                <polygon
                    points={`${examPoints[0].x},${MARGIN.top + chartH} ${examPoints.map((p) => `${p.x},${p.y}`).join(' ')} ${examPoints[examPoints.length - 1].x},${MARGIN.top + chartH}`}
                    fill="url(#areaExam)"
                />
            )}

            {/* Exam line */}
            {examPoints.length > 1 && (
                <polyline
                    points={examPoints.map((p) => `${p.x},${p.y}`).join(' ')}
                    fill="none"
                    stroke={examColor}
                    strokeWidth={2}
                    strokeLinejoin="round"
                    strokeLinecap="round"
                />
            )}

            {/* Dots */}
            {points.map((p, i) => (
                <g key={i}>
                    <title>{`${p.percentage}%`}</title>
                    <text
                        x={p.x}
                        y={p.y - 8}
                        textAnchor="middle"
                        fontSize={9}
                        className="fill-muted-foreground/70"
                    >
                        {p.percentage}%
                    </text>
                    <circle
                        cx={p.x}
                        cy={p.y}
                        r={4}
                        fill={p.type === 'exam' ? examColor : practiceColor}
                        stroke="#fff"
                        strokeWidth={2}
                    />
                </g>
            ))}
        </svg>
    );
}
