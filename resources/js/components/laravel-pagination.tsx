import { Link } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react';

import { buttonVariants } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import type { PaginationMeta } from '@/types/pagination';

interface LaravelPaginationProps {
    meta: PaginationMeta;
}

export function LaravelPagination({ meta }: LaravelPaginationProps) {
    if (meta.last_page <= 1) return null;

    const pageLinks = meta.links.slice(1, -1);

    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    <Link
                        href={meta.prev_page_url ?? '#'}
                        className={cn(
                            buttonVariants({ variant: 'ghost', size: 'default' }),
                            'gap-1 px-2.5 sm:pl-2.5',
                            !meta.prev_page_url && 'pointer-events-none opacity-50',
                        )}
                        preserveState
                        disabled={!meta.prev_page_url}
                    >
                        <ChevronRightIcon className="size-4" />
                        <span className="hidden sm:block">السابق</span>
                    </Link>
                </PaginationItem>

                {pageLinks.map((link, i) => {
                    if (!link.url || link.label === '...') {
                        return (
                            <PaginationItem key={`e${i}`}>
                                <span
                                    aria-hidden
                                    className="flex size-9 items-center justify-center"
                                >
                                    <MoreHorizontalIcon className="size-4" />
                                </span>
                            </PaginationItem>
                        );
                    }

                    return (
                        <PaginationItem key={i}>
                            <Link
                                href={link.url}
                                className={buttonVariants({
                                    variant: link.active ? 'outline' : 'ghost',
                                    size: 'icon',
                                })}
                                preserveState
                            >
                                {link.label}
                            </Link>
                        </PaginationItem>
                    );
                })}

                <PaginationItem>
                    <Link
                        href={meta.next_page_url ?? '#'}
                        className={cn(
                            buttonVariants({ variant: 'ghost', size: 'default' }),
                            'gap-1 px-2.5 sm:pr-2.5',
                            !meta.next_page_url && 'pointer-events-none opacity-50',
                        )}
                        preserveState
                        disabled={!meta.next_page_url}
                    >
                        <span className="hidden sm:block">التالي</span>
                        <ChevronLeftIcon className="size-4" />
                    </Link>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
