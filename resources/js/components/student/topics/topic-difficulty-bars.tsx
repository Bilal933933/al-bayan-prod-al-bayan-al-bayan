interface DifficultyInfo {
    count: number;
    percentage: number;
}

interface TopicDifficultyBarsProps {
    distribution: Record<string, DifficultyInfo>;
}

const difficultyMeta: Record<
    string,
    { label: string; color: string; barColor: string }
> = {
    easy: {
        label: 'سهل',
        color: 'text-emerald-600',
        barColor: 'bg-emerald-500',
    },
    medium: {
        label: 'متوسط',
        color: 'text-amber-600',
        barColor: 'bg-amber-500',
    },
    hard: { label: 'صعب', color: 'text-red-500', barColor: 'bg-red-500' },
};

export default function TopicDifficultyBars({
    distribution,
}: TopicDifficultyBarsProps) {
    const items = Object.entries(distribution).map(([key, info]) => ({
        key,
        ...(difficultyMeta[key] ?? {
            label: key,
            color: 'text-gray-600',
            barColor: 'bg-gray-500',
        }),
        ...info,
    }));

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <div key={item.key}>
                    <div className="mb-1.5 flex justify-between text-sm">
                        <span className="font-semibold text-gray-600">
                            {item.label}
                        </span>
                        <span className={`font-bold ${item.color}`}>
                            {item.percentage}%
                        </span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                            className={`h-full rounded-full transition-all duration-700 ${item.barColor}`}
                            style={{ width: `${item.percentage}%` }}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}
