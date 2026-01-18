'use client';

import { useState } from 'react';
import { MainLayout, ClientNavigation } from '@/components/layout';
import { ClientSelector } from '@/components/dashboard';
import { useClients } from '@/hooks';
import { Wallet } from 'lucide-react';

export default function HistoryPage() {
    const { data: clients } = useClients();
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

    const selectedClient = clients?.find(c => c.id === selectedClientId) || null;

    const handleClientSelect = (client: any) => {
        setSelectedClientId(client.id);
    };

    return (
        <MainLayout>
            <div className="flex flex-col min-h-screen p-8">
                <div className="max-w-[1600px] mx-auto space-y-8 w-full">

                    {/* Header: Selectors & Navigation */}
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <ClientSelector
                                clients={clients || []}
                                selectedClient={selectedClient}
                                onSelect={handleClientSelect}
                            />
                        </div>

                        <ClientNavigation />
                    </div>

                    {/* Content */}
                    <div className="h-[60vh] flex flex-col items-center justify-center text-muted-foreground space-y-4 border border-[#333333] rounded-2xl bg-[#141414]">
                        <Wallet className="h-16 w-16 opacity-20" />
                        <h2 className="text-2xl font-semibold">Histórico de Movimentações</h2>
                        <p className="text-lg">Em breve: visualize o histórico completo de alterações patrimoniais.</p>
                    </div>

                </div>
            </div>
        </MainLayout>
    );
}
