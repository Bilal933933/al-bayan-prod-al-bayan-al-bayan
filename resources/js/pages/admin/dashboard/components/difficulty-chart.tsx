import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from 'recharts';

interface DifficultyChartProps {
    distribution: {
        easy: number;
        medium: number;
        hard: number;
    };
}

const COLORS = {
    easy: '#34d399',
    medium: '#fbbf24',
    hard: '#f87171',
};

export function DifficultyChart({ distribution }: DifficultyChartProps) {
    const data = [
        { name: 'سهل', value: distribution.easy, color: COLORS.easy },
        { name: 'متوسط', value: distribution.medium, color: COLORS.medium },
        { name: 'صعب', value: distribution.hard, color: COLORS.hard },
    ].filter((d) => d.value > 0);

    if (data.length === 0) {
        return (
            <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
                لا توجد بيانات
            </div>
        );
    }

    return (
        <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={85}
                        paddingAngle={2}
                        dataKey="value"
                    >
                        {data.map((entry) => (
                            <Cell key={entry.name} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value) => [value, 'سؤال']}
                        contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            fontSize: '13px',
                        }}
                    />
                    <Legend
                        formatter={(value: string) => (
                            <span style={{ fontSize: '12px', fontWeight: 500 }}>
                                {value}
                            </span>
                        )}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
