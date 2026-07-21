interface ProfileTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

const tabs = [
    { id: 'overview', label: 'نظرة عامة' },
    { id: 'achievements', label: 'الإنجازات' },
    { id: 'history', label: 'السجل' },
];

export function ProfileTabs({ activeTab, onTabChange }: ProfileTabsProps) {
    return (
        <div className="flex gap-1 overflow-x-auto border-b">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={`whitespace-nowrap border-b-2 px-5 py-3 text-sm font-semibold transition-colors
                        ${activeTab === tab.id
                            ? 'border-primary text-primary'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
