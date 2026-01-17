'use client';

import { cn } from '@/lib/utils';

interface PatrimonyCardProps {
    year: number;
    label?: string;
    age: number;
    value: number;
    percentChange?: number;
    variant?: 'default' | 'highlight' | 'blue';
}

export function PatrimonyCard({
    year,
    label,
    age,
    value,
    percentChange,
    variant = 'default',
}: PatrimonyCardProps) {
    const isPositive = percentChange && percentChange > 0;

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 2,
        }).format(val);
    };

    const getGradientStyle = () => {
        switch (variant) {
            case 'highlight':
                // Green gradient: #03B6AD
                return { background: 'linear-gradient(to bottom, #03B6AD, #028a84)' };
            case 'blue':
                // Blue gradient: #6777FA
                return { background: 'linear-gradient(to bottom, #6777FA, #4a5bc8)' };
            default:
                // Gray striped
                return { background: 'linear-gradient(to bottom, #404040, #2a2a2a)' };
        }
    };

    return (
        <div className="flex flex-col items-center min-w-[120px]">
            {/* Value and percent */}
            <div className="text-center mb-2">
                <div className="text-sm font-medium text-foreground whitespace-nowrap">
                    {formatCurrency(value)}
                    {percentChange !== undefined && (
                        <span
                            className="ml-1 text-xs"
                            style={{ color: '#68AAF1' }}
                        >
                            {isPositive ? '+' : ''}
                            {percentChange.toFixed(2)}%
                        </span>
                    )}
                </div>
            </div>

            {/* Gradient bar */}
            <div
                className="w-full h-16 rounded-lg overflow-hidden relative"
                style={getGradientStyle()}
            >
                {/* Striped pattern for non-current years */}
                {variant === 'default' && (
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.08) 3px, rgba(255,255,255,0.08) 6px)',
                        }}
                    />
                )}
            </div>

            {/* Year and age */}
            <div className="text-center mt-2">
                <div className="text-xs text-muted-foreground">
                    {year} {label && <span className="text-primary">{label}</span>}
                </div>
                <div className="text-sm font-medium text-foreground">{age} anos</div>
            </div>
        </div>
    );
}
