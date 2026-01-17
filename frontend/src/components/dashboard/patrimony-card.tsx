'use client';

import { cn } from '@/lib/utils';

interface PatrimonyCardProps {
    year: number;
    label?: string;
    age: number;
    value: number;
    percentChange?: number;
    isHighlight?: boolean;
}

export function PatrimonyCard({
    year,
    label,
    age,
    value,
    percentChange,
    isHighlight = false,
}: PatrimonyCardProps) {
    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 2,
        }).format(val);
    };

    // First card (highlight) = solid gradient, others = striped
    const getBarStyle = () => {
        if (isHighlight) {
            // Solid horizontal gradient blue to green: #6777FA -> #03B6AD
            return {
                background: 'linear-gradient(to right, #6777FA, #03B6AD)',
            };
        }
        // Striped with gradient
        return {
            background: 'linear-gradient(to right, #4a5bc8, #028a84)',
        };
    };

    return (
        <div className="flex flex-col items-start min-w-[140px]">
            {/* Value and percent */}
            <div className="mb-2">
                <span className="text-sm font-medium text-foreground whitespace-nowrap">
                    {formatCurrency(value)}
                </span>
                {percentChange !== undefined && (
                    <span
                        className="ml-2 text-xs"
                        style={{ color: '#68AAF1' }}
                    >
                        {percentChange > 0 ? '+' : ''}
                        {percentChange.toFixed(2)}%
                    </span>
                )}
            </div>

            {/* Progress bar */}
            <div
                className="w-full h-14 rounded-lg overflow-hidden relative"
                style={getBarStyle()}
            >
                {/* Striped pattern for non-highlight cards */}
                {!isHighlight && (
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
                        }}
                    />
                )}
            </div>

            {/* Year, label and age */}
            <div className="mt-2">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{year}</span>
                    {label && (
                        <span
                            className="text-xs px-2 py-0.5 rounded"
                            style={{
                                backgroundColor: 'rgba(83, 132, 235, 0.24)', // #5384EB3D
                                color: '#68AAF1'
                            }}
                        >
                            {label}
                        </span>
                    )}
                </div>
                <div
                    className="text-sm font-medium"
                    style={{ color: '#68AAF1' }}
                >
                    {age} anos
                </div>
            </div>
        </div>
    );
}
