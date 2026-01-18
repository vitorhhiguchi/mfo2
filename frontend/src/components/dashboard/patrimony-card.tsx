'use client';

import { cn } from '@/lib/utils';

interface PatrimonyCardProps {
    year: number;
    label?: string;
    age: number;
    value: number;
    percentChange?: number;
    isHighlight?: boolean;  // For "Aposentadoria" card - solid green
    isFirst?: boolean;      // For "Hoje" card - solid blue/green gradient
}

export function PatrimonyCard({
    year,
    label,
    age,
    value,
    percentChange,
    isHighlight = false,
    isFirst = false,
}: PatrimonyCardProps) {
    const formatCurrency = (val: number) => {
        if (isNaN(val) || val === undefined || val === null) {
            return 'R$ --';
        }
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 2,
        }).format(val);
    };

    const formatPercent = (val?: number) => {
        if (val === undefined || val === null || isNaN(val)) {
            return null;
        }
        const sign = val > 0 ? '+' : '';
        return `${sign}${val.toFixed(2)}%`;
    };

    // Determine bar background based on card type
    const getBarBackground = () => {
        if (isFirst) {
            // First card "Hoje" - solid gradient blue to teal
            return 'linear-gradient(to right, #6777FA, #03B6AD)';
        }
        if (isHighlight) {
            // Last card "Aposentadoria" - solid gradient teal to green
            return 'linear-gradient(to right, #03B6AD, #48F7A1)';
        }
        // Middle cards - gradient with vertical stripes
        return 'linear-gradient(to right, #5570D6, #03A89F)';
    };

    // Vertical stripes overlay for middle cards
    const stripesPattern = 'repeating-linear-gradient(90deg, transparent 0px, transparent 2px, rgba(0,0,0,0.4) 2px, rgba(0,0,0,0.4) 4px)';

    const showStripes = !isFirst && !isHighlight;

    return (
        <div className="flex flex-col items-start min-w-[160px]">
            {/* Value and percent change */}
            <div className="mb-2 flex items-baseline gap-2">
                <span className="text-sm font-semibold text-white whitespace-nowrap">
                    {formatCurrency(value)}
                </span>
                {percentChange !== undefined && formatPercent(percentChange) && (
                    <span
                        className="text-xs font-medium"
                        style={{ color: percentChange >= 0 ? '#48F7A1' : '#FF5151' }}
                    >
                        {formatPercent(percentChange)}
                    </span>
                )}
            </div>

            {/* Progress bar with gradient and optional stripes */}
            <div
                className="w-full h-16 rounded-lg overflow-hidden relative"
                style={{ background: getBarBackground() }}
            >
                {showStripes && (
                    <div
                        className="absolute inset-0"
                        style={{ background: stripesPattern }}
                    />
                )}
            </div>

            {/* Year, label and age */}
            <div className="mt-2 flex flex-col gap-0.5">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-medium">{year}</span>
                    {label && (
                        <span
                            className="text-xs px-2 py-0.5 rounded font-medium"
                            style={{
                                backgroundColor: 'rgba(83, 132, 235, 0.24)',
                                color: '#68AAF1'
                            }}
                        >
                            {label}
                        </span>
                    )}
                </div>
                <span
                    className="text-sm font-medium"
                    style={{ color: '#68AAF1' }}
                >
                    {age} anos
                </span>
            </div>
        </div>
    );
}
