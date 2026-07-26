import { motion } from 'framer-motion';

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
        <div className="relative flex gap-1 rounded-xl bg-muted p-1">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className="relative z-10 flex-1 rounded-lg px-5 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors"
                    style={{
                        color:
                            activeTab === tab.id
                                ? 'var(--brand-surface)'
                                : undefined,
                    }}
                >
                    {activeTab === tab.id && (
                        <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 rounded-lg bg-brand-teal"
                            transition={{
                                type: 'spring',
                                stiffness: 400,
                                damping: 30,
                            }}
                        />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                </button>
            ))}
        </div>
    );
}
