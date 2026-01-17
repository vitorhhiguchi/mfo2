'use client';

import { cn } from '@/lib/utils';
import type { Insurance } from '@/types';

interface InsuranceCardProps {
    insurance: Insurance;
}

export function InsuranceCard({ insurance }: InsuranceCardProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <div className="p-5 rounded-2xl bg-[#1a1a1a] border border-[#67AEFA] relative flex justify-between items-start">
            <div>
                <h3 className="text-lg font-normal text-[#e5e5e5] mb-2">{insurance.name}</h3>

                <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">
                        Seguro de {insurance.type === 'LIFE' ? 'Vida' : 'Invalidez'}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Duração: <span className="text-[#e5e5e5]">15 anos</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Prêmio: <span className="text-[#e5e5e5]">{formatCurrency(insurance.premium)}/mês</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center self-end mt-auto">
                <span className="text-lg font-medium text-[#a855f7]">
                    {formatCurrency(insurance.insuredValue)}
                </span>
            </div>
        </div>
    );
}
