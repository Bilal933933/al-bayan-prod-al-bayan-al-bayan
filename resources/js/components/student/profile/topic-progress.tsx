import { BookOpen } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { TopicProgress } from '@/types/profile';

interface TopicProgressListProps {
    data: TopicProgress[];
}

export function TopicProgressList({ data }: TopicProgressListProps) {
    const [visible, setVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
 if (entry.isIntersecting) {
setVisible(true);
} 
},
            { threshold: 0.1 },
        );

        if (ref.current) {
observer.observe(ref.current);
}

        return () => observer.disconnect();
    }, []);

    if (!data.length) {
        return null;
    }

    return (
        <div ref={ref}>
            <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-bold">تقدم المواضيع</h3>
            </div>
            <div className="space-y-3.5">
                {data.map((item, i) => (
                    <div key={i}>
                        <div className="mb-1.5 flex justify-between text-sm">
                            <span className="font-medium">{item.name}</span>
                            <span className="text-muted-foreground">{item.percentage}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                            <div
                                className="h-full rounded-full bg-gradient-to-l from-primary to-primary-dark transition-all duration-1000"
                                style={{ width: visible ? `${item.percentage}%` : '0%' }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
