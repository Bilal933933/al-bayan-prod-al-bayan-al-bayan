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
        border: 'border-palette-1/30',
        bg: 'bg-palette-1/10',
        text: 'text-palette-1',
        primary: 'bg-palette-1 hover:bg-palette-1/90',
        hover: 'hover:border-palette-1/50',
        from: 'from-palette-1/10',
        icon: 'text-palette-1',
    },
    {
        border: 'border-palette-2/30',
        bg: 'bg-palette-2/10',
        text: 'text-palette-2',
        primary: 'bg-palette-2 hover:bg-palette-2/90',
        hover: 'hover:border-palette-2/50',
        from: 'from-palette-2/10',
        icon: 'text-palette-2',
    },
    {
        border: 'border-palette-3/30',
        bg: 'bg-palette-3/10',
        text: 'text-palette-3',
        primary: 'bg-palette-3 hover:bg-palette-3/90',
        hover: 'hover:border-palette-3/50',
        from: 'from-palette-3/10',
        icon: 'text-palette-3',
    },
    {
        border: 'border-palette-4/30',
        bg: 'bg-palette-4/10',
        text: 'text-palette-4',
        primary: 'bg-palette-4 hover:bg-palette-4/90',
        hover: 'hover:border-palette-4/50',
        from: 'from-palette-4/10',
        icon: 'text-palette-4',
    },
    {
        border: 'border-palette-5/30',
        bg: 'bg-palette-5/10',
        text: 'text-palette-5',
        primary: 'bg-palette-5 hover:bg-palette-5/90',
        hover: 'hover:border-palette-5/50',
        from: 'from-palette-5/10',
        icon: 'text-palette-5',
    },
];

export function getColor(id: number | undefined | null): TopicColorSet {
    if (id === undefined || id === null || isNaN(id)) {
        return topicColors[0];
    }
    return topicColors[Math.abs(id) % topicColors.length] ?? topicColors[0];
}
