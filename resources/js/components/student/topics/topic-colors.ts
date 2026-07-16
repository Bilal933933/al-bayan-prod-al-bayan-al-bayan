export interface TopicColorSet {
    border: string;
    bg: string;
    text: string;
    primary: string;
    hover: string;
    from: string;
    icon: string;
}

export const topicColors: TopicColorSet[] = [
    {
        border: 'border-blue-200',
        bg: 'bg-blue-50/50',
        text: 'text-blue-700',
        primary: 'bg-blue-600 hover:bg-blue-700',
        hover: 'hover:border-blue-300',
        from: 'from-blue-500/10',
        icon: 'text-blue-600',
    },
    {
        border: 'border-emerald-200',
        bg: 'bg-emerald-50/50',
        text: 'text-emerald-700',
        primary: 'bg-emerald-600 hover:bg-emerald-700',
        hover: 'hover:border-emerald-300',
        from: 'from-emerald-500/10',
        icon: 'text-emerald-600',
    },
    {
        border: 'border-violet-200',
        bg: 'bg-violet-50/50',
        text: 'text-violet-700',
        primary: 'bg-violet-600 hover:bg-violet-700',
        hover: 'hover:border-violet-300',
        from: 'from-violet-500/10',
        icon: 'text-violet-600',
    },
    {
        border: 'border-amber-200',
        bg: 'bg-amber-50/50',
        text: 'text-amber-700',
        primary: 'bg-amber-600 hover:bg-amber-700',
        hover: 'hover:border-amber-300',
        from: 'from-amber-500/10',
        icon: 'text-amber-600',
    },
    {
        border: 'border-rose-200',
        bg: 'bg-rose-50/50',
        text: 'text-rose-700',
        primary: 'bg-rose-600 hover:bg-rose-700',
        hover: 'hover:border-rose-300',
        from: 'from-rose-500/10',
        icon: 'text-rose-600',
    },
];

export function getColor(id: number | undefined | null): TopicColorSet {
    if (id === undefined || id === null || isNaN(id)) {
        return topicColors[0];
    }
    return topicColors[Math.abs(id) % topicColors.length] ?? topicColors[0];
}
