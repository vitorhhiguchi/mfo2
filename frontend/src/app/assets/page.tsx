'use client';

import { useState, useMemo } from 'react';
import { useClients, useSimulations, useAssets, useCreateSimulation } from '@/hooks';
import { ClientSelector, SimulationSelector } from '@/components/dashboard';
import { AssetCard, AssetModal } from '@/components/assets';
import { MainLayout, ClientNavigation } from '@/components/layout';
import { Asset, CreateAssetInput } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Plus, Wallet, MoreVertical, History, Settings } from 'lucide-react';
import { format, parseISO, isSameDay, isBefore } from 'date-fns';
import { SimulationModal, SimulationFormData } from '@/components/dashboard/simulation-modal';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function AssetsPage() {
    // ---- State Management ----
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [selectedSimulationId, setSelectedSimulationId] = useState<number | null>(null);
    const [displayDate, setDisplayDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));
    const router = useRouter();

    // Modals
    const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
    const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
    const [isSimModalOpen, setIsSimModalOpen] = useState(false);

    // ---- Data Fetching ----
    const { data: clients } = useClients();
    const { data: simulations } = useSimulations(selectedClientId || undefined);
    const {
        assets,
        createAsset,
        updateAsset,
        deleteAsset
    } = useAssets(selectedSimulationId || undefined);
    const { mutateAsync: createSimulation } = useCreateSimulation();

    // ---- Derived State ----
    const selectedClient = clients?.find(c => c.id === selectedClientId) || null;

    // Filter Assets by Type
    const financialAssets = assets?.filter(a => a.type === 'FINANCIAL') || [];
    const realEstateAssets = assets?.filter(a => a.type === 'REAL_ESTATE') || [];

    // Calculate Totals based on Display Date
    const getAssetValueAtDate = (asset: Asset, dateStr: string) => {
        const targetDate = parseISO(dateStr);
        const sortedRecords = [...asset.records].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        let value = 0;
        for (const record of sortedRecords) {
            if (isBefore(parseISO(record.date), targetDate) || isSameDay(parseISO(record.date), targetDate)) {
                value = record.value;
            } else {
                break;
            }
        }
        return value;
    };

    const totalAllocated = useMemo(() => {
        if (!assets) return 0;
        return assets.reduce((acc, asset) => acc + getAssetValueAtDate(asset, displayDate), 0);
    }, [assets, displayDate]);


    // ---- Handlers ----
    const handleClientSelect = (client: any) => {
        setSelectedClientId(client.id);
        setSelectedSimulationId(null);
    };

    const handleSimulationSelect = (simulationId: string) => {
        setSelectedSimulationId(Number(simulationId));
    };

    const handleCreateAsset = async (data: CreateAssetInput) => {
        if (!selectedSimulationId) return;
        await createAsset.mutateAsync({ ...data, simulationId: selectedSimulationId });
    };

    const handleUpdateAsset = async (data: CreateAssetInput) => {
        if (!editingAsset) return;
        await updateAsset.mutateAsync({ id: editingAsset.id, data });
        setEditingAsset(null);
    };

    const handleQuickUpdate = async () => {
        alert("Funcionalidade de Atualização Rápida em Breve");
    };

    const handleCreateSimulation = async (data: SimulationFormData) => {
        if (!selectedClientId) return;
        try {
            await createSimulation({
                name: data.name,
                startDate: data.startDate.toISOString().split('T')[0],
                realRate: data.inflationRate,
                clientId: selectedClientId,
            });
            setIsSimModalOpen(false);
        } catch (error) {
            console.error(error);
        }
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

                            {selectedClientId && (
                                <SimulationSelector
                                    simulations={simulations || []}
                                    selectedIds={selectedSimulationId ? [selectedSimulationId] : []}
                                    onToggle={(id) => handleSimulationSelect(id.toString())}
                                    onAddClick={() => setIsSimModalOpen(true)}
                                />
                            )}
                        </div>

                        <ClientNavigation />
                    </div>

                    {/* Main Content Area */}
                    {selectedSimulationId ? (
                        <div className="space-y-8">

                            {/* Summary & Controls Header */}
                            <div className="relative border border-[#333333] rounded-2xl p-6 bg-[#141414]">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">

                                    {/* Total Value (Left) */}
                                    <div className="min-w-[200px]">
                                        <h2 className="text-sm font-medium text-muted-foreground mb-1">Total alocado</h2>
                                        <div className="text-3xl font-bold text-white">
                                            {formatCurrency(totalAllocated)}
                                        </div>
                                    </div>

                                    {/* Date & Settings (Center) */}
                                    <div className="flex flex-col items-center gap-1 flex-1">
                                        <label className="text-xs text-muted-foreground font-medium">Data da alocação</label>
                                        <div className="relative flex items-center gap-3">
                                            <input
                                                type="date"
                                                value={displayDate}
                                                onChange={(e) => setDisplayDate(e.target.value)}
                                                className="bg-[#0f0f0f] border border-[#333333] text-white text-sm rounded-md pl-3 pr-2 py-2 focus:ring-1 focus:ring-[#6777FA] outline-none"
                                            />
                                            <button className="text-muted-foreground hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
                                                <MoreVertical className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Update Actions (Right) */}
                                    <div className="min-w-[200px] flex justify-end">
                                        <button
                                            onClick={handleQuickUpdate}
                                            className="px-6 py-2 bg-[#FF9343] hover:bg-[#FF9343]/90 text-black font-semibold rounded-full text-sm transition-colors flex items-center gap-2"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Atualizar
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Assets Columns */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                                {/* Financial Assets */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-muted-foreground">Financeiras</h3>
                                        <button
                                            onClick={() => {
                                                setEditingAsset(null);
                                                setIsAssetModalOpen(true);
                                            }}
                                            className="text-[#FF9343] hover:text-[#FFDBA0] text-sm font-medium flex items-center gap-1 transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Adicionar
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {financialAssets.length > 0 ? (
                                            financialAssets.map(asset => (
                                                <AssetCard
                                                    key={asset.id}
                                                    asset={asset}
                                                    date={parseISO(displayDate)}
                                                    onEdit={(a) => {
                                                        setEditingAsset(a);
                                                        setIsAssetModalOpen(true);
                                                    }}
                                                    onDelete={(a) => {
                                                        if (confirm(`Excluir ${a.name}?`)) deleteAsset.mutate(a.id);
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <div className="h-32 border border-dashed border-[#333333] rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                                                Nenhuma alocação financeira
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Real Estate Assets */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-medium text-muted-foreground">Imobilizadas</h3>
                                        <button
                                            onClick={() => {
                                                setEditingAsset(null);
                                                setIsAssetModalOpen(true);
                                            }}
                                            className="text-[#FF9343] hover:text-[#FFDBA0] text-sm font-medium flex items-center gap-1 transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Adicionar
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {realEstateAssets.length > 0 ? (
                                            realEstateAssets.map(asset => (
                                                <AssetCard
                                                    key={asset.id}
                                                    asset={asset}
                                                    date={parseISO(displayDate)}
                                                    onEdit={(a) => {
                                                        setEditingAsset(a);
                                                        setIsAssetModalOpen(true);
                                                    }}
                                                    onDelete={(a) => {
                                                        if (confirm(`Excluir ${a.name}?`)) deleteAsset.mutate(a.id);
                                                    }}
                                                />
                                            ))
                                        ) : (
                                            <div className="h-32 border border-dashed border-[#333333] rounded-lg flex items-center justify-center text-muted-foreground text-sm">
                                                Nenhum ativo imobolizado
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>
                    ) : (
                        <div className="h-[60vh] flex flex-col items-center justify-center text-muted-foreground space-y-4">
                            <Wallet className="h-16 w-16 opacity-20" />
                            <p className="text-lg">Selecione um cliente e uma simulação para gerenciar alocações</p>
                        </div>
                    )}
                </div>

                {/* Modals */}
                <AssetModal
                    open={isAssetModalOpen}
                    onOpenChange={setIsAssetModalOpen}
                    onSubmit={editingAsset ? handleUpdateAsset : handleCreateAsset}
                    simulationId={selectedSimulationId!}
                    initialData={editingAsset}
                />

                <SimulationModal
                    open={isSimModalOpen}
                    onOpenChange={setIsSimModalOpen}
                    onSubmit={handleCreateSimulation}
                    initialData={null}
                />
            </div>
        </MainLayout>
    );
}
