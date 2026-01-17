'use client';

import { cn } from '@/lib/utils';
import { MoreVertical } from 'lucide-react';
import type { Simulation } from '@/types';

// Anka Design System Colors
const ANKA_COLORS = {
    blue: '#67AEFA',    // Plano Original
    green: '#48F7A1',   // Situação Atual
    yellow: '#F7B748',  // Realizado
    gray: '#C9C9C9',    // Adicionar
};

interface SimulationPillProps {
    simulation: Simulation;
    isSelected: boolean;
    variant: 'original' | 'current' | 'realized';
    onClick: () => void;
    onMenuClick?: () => void;
}

export function SimulationPill({
    simulation,
    isSelected,
    variant,
    onClick,
    onMenuClick,
}: SimulationPillProps) {
    const getColor = () => {
        switch (variant) {
            case 'original':
                return ANKA_COLORS.blue;
            case 'current':
                return ANKA_COLORS.green;
            case 'realized':
                return ANKA_COLORS.yellow;
            default:
                return ANKA_COLORS.gray;
        }
    };

    const color = getColor();

    return (
        <button
            onClick={onClick}
            className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-full border transition-all',
                'text-sm font-medium',
                isSelected
                    ? 'bg-transparent'
                    : 'bg-transparent border-[#333333] text-muted-foreground hover:border-[#444444]'
            )}
            style={isSelected ? { borderColor: color } : undefined}
        >
            <div
                className="w-3 h-3 rounded-full border-2"
                style={{
                    borderColor: color,
                    backgroundColor: isSelected ? color : 'transparent',
                }}
            />
            <span style={{ color: isSelected ? color : undefined }}>
                {simulation.name}
            </span>
            {onMenuClick && (
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onMenuClick();
                    }}
                    className="ml-1 text-muted-foreground hover:text-foreground"
                >
                    <MoreVertical className="h-4 w-4" />
                </button>
            )}
        </button>
    );
}

interface SimulationSelectorProps {
    simulations: Simulation[];
    selectedIds: number[];
    onToggle: (id: number) => void;
    onAddClick?: () => void;
}

export function SimulationSelector({
    simulations,
    selectedIds,
    onToggle,
    onAddClick,
}: SimulationSelectorProps) {
    return (
        <div className="flex items-center justify-center gap-3 flex-wrap">
            {simulations.map((sim, index) => (
                <SimulationPill
                    key={sim.id}
                    simulation={sim}
                    isSelected={selectedIds.includes(sim.id)}
                    variant={sim.isCurrentSituation ? 'original' : 'current'}
                    onClick={() => onToggle(sim.id)}
                    onMenuClick={() => { }}
                />
            ))}
            <button
                className="flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium transition-colors"
                style={{ borderColor: ANKA_COLORS.yellow, color: ANKA_COLORS.yellow }}
            >
                <div
                    className="w-3 h-3 rounded-full border-2"
                    style={{ borderColor: ANKA_COLORS.yellow }}
                />
                Realizado
            </button>
            {onAddClick && (
                <button
                    onClick={onAddClick}
                    className="px-4 py-2 text-sm transition-colors"
                    style={{ color: ANKA_COLORS.gray }}
                >
                    + Adicionar Simulação
                </button>
            )}
        </div>
    );
}
