'use client';

import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { TimelineEvent } from '@/types';

interface TimelineProps {
    incomeEvents: TimelineEvent[];
    expenseEvents: TimelineEvent[];
    startYear: number;
    endYear: number;
    clientBirthYear: number;
    onAddClick: () => void;
}

export function Timeline({
    incomeEvents,
    expenseEvents,
    startYear,
    endYear,
    clientBirthYear,
    onAddClick,
}: TimelineProps) {
    // Generate year markers (every 5 years)
    const years: number[] = [];
    for (let y = startYear; y <= endYear; y += 5) {
        years.push(y);
    }

    const totalYears = endYear - startYear;

    const getPosition = (year: number) => {
        return ((year - startYear) / totalYears) * 100;
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-medium" style={{ color: '#67AEFA' }}>Timeline</h3>
                <button
                    onClick={onAddClick}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded-full border border-[#333333] text-sm text-muted-foreground hover:text-foreground hover:border-[#444444] transition-colors"
                >
                    <Plus className="h-4 w-4" />
                    Adicionar
                </button>
            </div>

            <div className="relative pt-12 pb-8 px-4">
                {/* Main Axis Line */}
                <div className="absolute top-1/2 left-0 w-full h-px bg-[#333333] -translate-y-1/2" />

                {/* Year/Age Markers - Centered Ruler */}
                <div className="relative h-12 flex items-center">
                    {years.map((year) => {
                        const age = year - clientBirthYear;
                        const left = `${getPosition(year)}%`;

                        return (
                            <div
                                key={year}
                                className="absolute transform -translate-x-1/2 flex flex-col items-center gap-1"
                                style={{ left }}
                            >
                                {/* Tick mark */}
                                <div className="h-3 w-px bg-[#333333]" />

                                <span className="text-sm font-medium text-foreground">{year}</span>
                                <span className="text-xs text-muted-foreground">{age}</span>
                            </div>
                        );
                    })}

                    {/* Minor ticks (every 1 year) */}
                    {Array.from({ length: totalYears + 1 }).map((_, i) => {
                        const year = startYear + i;
                        if (year % 5 === 0) return null; // Skip major ticks
                        return (
                            <div
                                key={year}
                                className="absolute h-1.5 w-px bg-[#262626] top-1/2 -translate-y-1/2 transform -translate-x-1/2"
                                style={{ left: `${getPosition(year)}%` }}
                            />
                        );
                    })}
                </div>

                {/* Income Track (Green) - Above */}
                <div className="absolute top-0 left-0 w-full">
                    {incomeEvents.map((event) => {
                        const startPos = getPosition(event.startYear);
                        const endPos = getPosition(event.endYear || endYear);
                        const width = endPos - startPos;

                        return (
                            <div
                                key={event.id}
                                className="absolute top-0"
                                style={{ left: `${startPos}%`, width: `${width}%` }}
                            >
                                {/* Line */}
                                <div
                                    className="h-0.5 w-full absolute top-5"
                                    style={{ backgroundColor: '#00C900' }}
                                />

                                {/* Start Dot */}
                                <div
                                    className="absolute top-3 w-4 h-4 rounded-full border-2 border-background z-10"
                                    style={{ backgroundColor: '#00C900' }}
                                />

                                {/* End Dot (if specific end year) */}
                                {event.endYear && (
                                    <div
                                        className="absolute top-3 right-0 w-4 h-4 rounded-full border-2 border-background z-10 translate-x-1/2"
                                        style={{ backgroundColor: '#00C900' }}
                                    />
                                )}

                                {/* Label */}
                                <span
                                    className="absolute -top-6 text-xs whitespace-nowrap"
                                    style={{ color: '#00C900' }}
                                >
                                    {event.name}
                                    {event.value && <span className="ml-1 opacity-80">{formatCurrency(event.value)}</span>}
                                </span>

                                {/* Value - Optional, if needed separately */}
                                {/* <span className="absolute -top-10 text-xs text-muted-foreground whitespace-nowrap">
                  {formatCurrency(event.value)}
                </span> */}
                            </div>
                        );
                    })}
                </div>

                {/* Expense Track (Red) - Below */}
                <div className="absolute bottom-0 left-0 w-full translate-y-full">
                    {expenseEvents.map((event) => {
                        const startPos = getPosition(event.startYear);
                        const endPos = getPosition(event.endYear || endYear);
                        const width = endPos - startPos;

                        return (
                            <div
                                key={event.id}
                                className="absolute top-0"
                                style={{ left: `${startPos}%`, width: `${width}%` }}
                            >
                                {/* Line */}
                                <div
                                    className="h-0.5 w-full absolute top-2"
                                    style={{ backgroundColor: '#FF5151' }}
                                />

                                {/* Start Dot */}
                                <div
                                    className="absolute top-0 w-4 h-4 rounded-full border-2 border-background z-10"
                                    style={{ backgroundColor: '#FF5151' }}
                                />

                                {/* Label */}
                                <div
                                    className="absolute top-6 left-0 text-xs flex flex-col"
                                    style={{ color: '#FF5151' }}
                                >
                                    <span className="whitespace-nowrap font-medium">{event.name}</span>
                                    <span className="whitespace-nowrap opacity-80">{formatCurrency(event.value)}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
