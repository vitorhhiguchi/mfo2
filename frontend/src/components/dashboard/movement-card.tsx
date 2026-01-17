'use client';

import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { Movement } from '@/types';

interface MovementCardProps {
    movement: Movement;
}

export function MovementCard({ movement }: MovementCardProps) {
    const isCredit = movement.value > 0;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0,
        }).format(Math.abs(val));
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return '';
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
        }).format(date);
    };

    return (
        <div className="p-5 rounded-2xl bg-[#1a1a1a] border border-[#67AEFA] relative flex justify-between items-start">
            <div>
                <h3 className="text-lg font-normal text-[#e5e5e5] mb-1">{movement.name}</h3>
                <div className="text-sm text-muted-foreground mb-1">
                    {formatDate(movement.startDate)} {movement.endDate ? `- ${formatDate(movement.endDate)}` : ''}
                </div>
                <div className="text-sm text-muted-foreground">
                    Frequência: <span className="text-[#e5e5e5]">{movement.frequency === 'MONTHLY' ? 'Mensal' : movement.frequency === 'ANNUALLY' ? 'Anual' : 'Única'}</span>
                </div>
                {movement.category && (
                    <div className="text-sm text-muted-foreground mt-1">
                        {movement.category === 'WORK' ? 'Trabalho' : movement.category === 'PASSIVE' ? 'Passiva' : 'Outros'}
                    </div>
                )}
            </div>

            <div className="flex items-center gap-2 self-end mt-auto">
                {isCredit ? (
                    <ArrowUp className="h-4 w-4 text-[#00C900]" />
                ) : (
                    <ArrowDown className="h-4 w-4 text-[#FF5151]" />
                )}
                <span
                    className={cn(
                        "text-lg font-medium",
                        isCredit ? "text-[#00C900]" : "text-[#FF5151]"
                    )}
                >
                    {formatCurrency(movement.value)}
                </span>
            </div>
        </div>
    );
}
