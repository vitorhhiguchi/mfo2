'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import type { Client } from '@/types';

interface ClientSelectorProps {
    clients: Client[];
    selectedClient: Client | null;
    onSelect: (client: Client) => void;
}

export function ClientSelector({
    clients,
    selectedClient,
    onSelect,
}: ClientSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'flex items-center justify-between gap-4 px-6 py-3 min-w-[280px]',
                    'rounded-full border border-[#333333]',
                    'bg-[#1a1a1a] hover:border-[#444444] transition-colors',
                    'text-lg font-normal text-foreground'
                )}
            >
                <span>{selectedClient?.name || 'Selecione um cliente'}</span>
                <ChevronDown
                    className={cn(
                        'h-5 w-5 text-muted-foreground transition-transform',
                        isOpen && 'rotate-180'
                    )}
                />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full left-0 mt-2 w-full bg-[#1a1a1a] border border-[#333333] rounded-2xl shadow-lg z-20 overflow-hidden">
                        {/* Header with placeholder */}
                        <div className="px-4 py-3 border-b border-[#333333]">
                            <span className="text-muted-foreground text-sm">Digite um nome</span>
                        </div>
                        {/* Client list */}
                        <div className="max-h-[200px] overflow-y-auto">
                            {clients.map((client) => (
                                <button
                                    key={client.id}
                                    onClick={() => {
                                        onSelect(client);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        'w-full px-4 py-3 text-left hover:bg-[#262626] transition-colors',
                                        'text-foreground text-base',
                                        selectedClient?.id === client.id && 'bg-[#262626]'
                                    )}
                                >
                                    {client.name}
                                </button>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
