'use client';

import { Asset } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';
import { Pencil, Trash2, Building2, Wallet } from 'lucide-react';
import { differenceInMonths, parseISO } from 'date-fns';

interface AssetCardProps {
    asset: Asset;
    date: Date; // Usado para calcular valor atual ou progresso
    onEdit: (asset: Asset) => void;
    onDelete: (asset: Asset) => void;
}

export function AssetCard({ asset, date, onEdit, onDelete }: AssetCardProps) {
    const isRealEstate = asset.type === 'REAL_ESTATE';

    // Obter o valor final (último registro)
    // No futuro, isso pode ser filtrado pela data selecionada
    const lastRecord = asset.records && asset.records.length > 0
        ? asset.records[asset.records.length - 1]
        : null;

    const currentValue = lastRecord ? lastRecord.value : 0;

    // Lógica para financiamento (progresso)
    const renderFinancingStatus = () => {
        if (!asset.financing) return null;

        const startDate = parseISO(asset.financing.startDate);
        const monthsPassed = differenceInMonths(date, startDate);
        const totalInstallments = asset.financing.installments;
        const progress = Math.min(monthsPassed, totalInstallments);

        // Se ainda não começou
        if (monthsPassed < 0) {
            return (
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white font-medium flex items-center gap-1">
                        $ Financiado
                    </span>
                    <span className="text-xs text-muted-foreground">
                        Início em {asset.financing.startDate.substring(0, 10)}
                    </span>
                </div>
            );
        }

        // Se já terminou
        if (monthsPassed >= totalInstallments) {
            return (
                <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#48F7A1]/10 text-[#48F7A1] font-medium">
                        Quitado
                    </span>
                </div>
            );
        }

        return (
            <div className="flex flex-col gap-1 mt-1">
                <div className="flex items-center gap-3">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white text-black font-bold flex items-center gap-1">
                        $ Financiado
                    </span>
                    {/* Valor total do financiamento ou parcela? O Figma mostra "R$ 148.666 de R$ 2.123.800"
                        Assumindo que o valor exibido no card (currentValue) é o valor JÁ PAGO (Equity).
                        E o valor total do imóvel é outra coisa?
                        Normalmente em Assets coloca-se o valor de mercado (Market Value).
                        O passivo (Dívida) é calculado separadamente.
                        
                        Mas seguindo o Figma "Progresso: 14/200 parcelas"
                     */}
                    <span className="text-xs text-muted-foreground">
                        Progresso: {progress}/{totalInstallments} parcelas
                    </span>
                </div>
            </div>
        );
    };

    return (
        <div className="group relative bg-[#1a1a1a] border border-[#333333] rounded-lg p-4 transition-all hover:border-[#555555]">
            <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                    <span className="font-semibold text-white text-base truncate max-w-[200px]" title={asset.name}>
                        {asset.name}
                    </span>

                    {!isRealEstate && (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">
                                {asset.type === 'FINANCIAL' ? 'Renda Fixa' : 'Outros'}
                            </span>
                        </div>
                    )}

                    {isRealEstate && renderFinancingStatus()}
                </div>

                <div className="flex flex-col items-end gap-1">
                    <span className="font-bold text-white text-lg">
                        {formatCurrency(currentValue)}
                    </span>

                    {/* Se tiver valor futuro/total, exibe aqui. Financiamento pode ter detalhes extras */}
                    {asset.financing && (
                        <span className="text-xs text-muted-foreground">
                            {/* Placeholder para info extra se necessário */}
                        </span>
                    )}
                </div>
            </div>

            {/* Actions (hover) */}
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-[#1a1a1a]/80 p-1 rounded-md backdrop-blur-sm">
                <button
                    onClick={() => onEdit(asset)}
                    className="p-1.5 text-muted-foreground hover:text-white hover:bg-white/10 rounded-md transition-colors"
                >
                    <Pencil className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onDelete(asset)}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-md transition-colors"
                >
                    <Trash2 className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
