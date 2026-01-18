'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function ClientNavigation() {
    const pathname = usePathname();

    const links = [
        { href: '/assets', label: 'Alocações' },
        { href: '/projection', label: 'Projeção' },
        { href: '/history', label: 'Histórico' },
    ];

    return (
        <div className="flex items-center gap-8 border-b border-[#333333] mb-8">
            {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "text-sm font-medium py-4 border-b-2 transition-colors",
                            isActive
                                ? "text-white border-[#F7B748]"
                                : "text-muted-foreground border-transparent hover:text-white/80 hover:border-white/20"
                        )}
                    >
                        {link.label}
                    </Link>
                );
            })}
        </div>
    );
}
