import type { Competition } from '@/types/competition';

export default function JoinHero({
    competition,
}: {
    competition: Competition;
}) {
    return (
        <div
            className="relative overflow-hidden p-8 text-white"
            style={{ backgroundColor: competition.color || '#1e293b' }}
        >
            <div className="absolute inset-0 z-0 bg-gradient-to-l from-black/20 to-transparent" />
            <div className="relative z-10 flex flex-col items-center gap-6 md:flex-row md:text-right">
                {competition.image_url ? (
                    <img
                        src={competition.image_url}
                        alt=""
                        className="h-20 w-20 rounded-2xl bg-white/10 object-cover p-1"
                    />
                ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 text-4xl">
                        <span aria-hidden="true">
                            {competition.icon || '🏆'}
                        </span>
                    </div>
                )}
                <div className="text-center md:text-right">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        مسابقة عامة
                    </span>
                    <h1 className="mt-2 text-2xl font-black md:text-3xl">
                        {competition.name}
                    </h1>
                    <p className="mt-2 max-w-xl text-sm font-medium text-white/80">
                        {competition.description ||
                            'شارك وتنافس مع زملائك في هذه المسابقة المخصصة لتعزيز مهاراتك المعرفية.'}
                    </p>
                </div>
            </div>
        </div>
    );
}
