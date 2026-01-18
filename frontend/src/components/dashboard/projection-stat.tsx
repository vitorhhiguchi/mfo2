'use client';

import { cn } from '@/lib/utils';

interface ProjectionStatProps {
    value: number;
    percentage?: number;
    year: number;
    age: number;
    progress: number;
    variant?: 'solid' | 'separated'; // 'solid' para hoje, 'separated' para projeções
    isToday?: boolean;
    label?: string; // Adicionado para manter compatibilidade com labels como "Aposentadoria"
}

export function ProjectionStat({
    value,
    percentage,
    year,
    age,
    progress,
    variant = 'separated',
    isToday,
    label
}: ProjectionStatProps) {
    // Configuração das barrinhas separadas
    const totalBars = 42; // Aumentei um pouco para preencher melhor containers largos
    const activeBars = Math.round((progress / 100) * totalBars);

    const formatCurrency = (val: number) => {
        if (isNaN(val) || val === undefined || val === null) return 'R$ --';
        if (val >= 1000000) {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
                maximumFractionDigits: 1,
            }).format(val);
        }
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0,
        }).format(val);
    };

    const formatPercentage = (val?: number) => {
        if (val === undefined || val === null || isNaN(val)) return null;
        const sign = val > 0 ? '+' : '';
        return `${sign}${val.toFixed(2)}%`;
    };

    return (
        <div className="flex flex-col gap-3 min-w-[200px] flex-1">
            {/* Valor e Porcentagem */}
            <div className="flex items-baseline gap-2 leading-none">
                <span className="text-[22px] font-bold text-white tracking-tight">
                    {formatCurrency(value)}
                </span>
                {percentage !== undefined && (
                    <span className={cn(
                        "text-[10px] font-bold translate-y-[-2px]",
                        percentage >= 0 ? "text-[#48F7A1]" : "text-[#FF5151]"
                    )}>
                        {formatPercentage(percentage)}
                    </span>
                )}
            </div>

            {/* Barra de Progresso */}
            <div className="h-12 w-full">
                {variant === 'solid' ? (
                    // Barra Sólida para o "Hoje" ou destaque
                    <div className="relative h-full w-full overflow-hidden rounded-md bg-[#292D52]/40">
                        <div
                            className="h-full w-full transition-all duration-700"
                            style={{
                                background: 'linear-gradient(90deg, #6777FA 0%, #03B6AD 100%)',
                                width: `${Math.max(progress, 5)}%` // Mínimo de 5% para visibilidade
                            }}
                        />
                    </div>
                ) : (
                    // Barras Separadas (Slats) para Projeção
                    <div className="flex h-full w-full gap-[3px]">
                        {activeBars > 0 ? Array.from({ length: totalBars }).map((_, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "h-full flex-1 rounded-[1px] transition-all duration-500",
                                    i < activeBars
                                        ? "bg-gradient-to-b from-[#5570D6] to-[#03A89F] opacity-80"
                                        : "bg-[#292D52]/40"
                                )}
                            />
                        )) : (
                            // Fallback sem dados visualmente agradável
                            Array.from({ length: totalBars }).map((_, i) => (
                                <div key={i} className="h-full flex-1 rounded-[1px] bg-[#292D52]/40" />
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Rodapé com quebra de linha */}
            <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                    <span className="text-[14px] font-bold text-slate-400">{year}</span>
                    {(isToday || label) && (
                        <span className={cn(
                            "text-[10px] font-black uppercase px-1.5 py-0.5 rounded-[3px]",
                            isToday
                                ? "text-[#5384EB] bg-[#5384EB]/20"
                                : "text-[#48F7A1] bg-[#48F7A1]/20"
                        )}>
                            {isToday ? 'Hoje' : label}
                        </span>
                    )}
                </div>
                <span className={cn(
                    "text-[15px] font-bold",
                    isToday ? "text-[#68AAF1]" : "text-[#68AAF1]"
                )}>
                    {age} anos
                </span>
            </div>
        </div>
    );
}
