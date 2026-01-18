'use client';

import { useState, useMemo } from 'react';
import { useClients, useSimulations, useAssets, useCreateSimulation } from '@/hooks';
import { ClientSelector, SimulationSelector, SimulationPill } from '@/components/dashboard';
import { AssetCard, AssetModal } from '@/components/assets';
import { Asset, CreateAssetInput } from '@/types';
import { cn, formatCurrency } from '@/lib/utils';
import { Pencil, Trash2, Building2, Wallet, Plus, Calendar, RotateCcw } from 'lucide-react';
import { format, parseISO, isSameDay, isBefore } from 'date-fns';
import { SimulationModal, SimulationFormData } from '@/components/dashboard/simulation-modal';
// Reusing Simulation logic from ProjectionPage (simplified)

export default function AssetsPage() {
    // ---- State Management (similar to ProjectionPage) ----
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
    const [selectedSimulationId, setSelectedSimulationId] = useState<number | null>(null);
    const [displayDate, setDisplayDate] = useState<string>(format(new Date(), 'yyyy-MM-dd'));

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
        deleteAsset,
        quickUpdateAsset
    } = useAssets(selectedSimulationId || undefined);
    const { mutateAsync: createSimulation } = useCreateSimulation();

    // ---- Derived State ----
    const selectedClient = clients?.find(c => c.id === selectedClientId) || null;
    const selectedSimulation = simulations?.find(s => s.id === selectedSimulationId) || null;

    // Filter Assets by Type
    const financialAssets = assets?.filter(a => a.type === 'FINANCIAL') || [];
    const realEstateAssets = assets?.filter(a => a.type === 'REAL_ESTATE') || [];

    // Calculate Totals based on Display Date
    // logic: for each asset, find the latest record on or before displayDate
    const getAssetValueAtDate = (asset: Asset, dateStr: string) => {
        const targetDate = parseISO(dateStr);
        // Sort records by date ascending
        const sortedRecords = [...asset.records].sort((a, b) =>
            new Date(a.date).getTime() - new Date(b.date).getTime()
        );

        let value = 0;
        // Find last record <= targetDate
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
        // Check if name or static details changed
        // For values, strictly we should use 'addRecord' logic but to simplify edit:
        // We just update the asset details. Value logic is separate or we assume initialValue edit?
        // Let's assume Update edits the Asset ENTITY, not records.
        await updateAsset.mutateAsync({ id: editingAsset.id, data });
        setEditingAsset(null);
    };

    const handleQuickUpdate = async () => {
        // This button "Atualizar" in Figma seems to trigger a global update or open a modal?
        // Implementation: Add a record for today for ALL assets? Or open a bulk edit modal?
        // For MVP: Simple alert or not implemented yet as per plan.
        // Let's make it alert for now.
        alert("Funcionalidade de Atualização Rápida em Breve");
    };

    return (
        <div className="min-h-screen bg-[#0f0f0f] text-foreground p-8">
            <div className="max-w-[1600px] mx-auto space-y-8">

                {/* Header / Config Bar */}
                <div className="flex items-center justify-between">
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
                </div>

                {/* Main Content Area */}
                {selectedSimulationId ? (
                    <div className="space-y-8">

                        {/* Summary & Controls Header */}
                        <div className="relative border border-[#333333] rounded-2xl p-6 bg-[#141414]">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">

                                {/* Total Value */}
                                <div>
                                    <h2 className="text-sm font-medium text-muted-foreground mb-1">Total alocado</h2>
                                    <div className="text-3xl font-bold text-white">
                                        {formatCurrency(totalAllocated)}
                                    </div>
                                </div>

                                {/* Date & Update Actions */}
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col gap-1">
                                        <label className="text-xs text-muted-foreground font-medium">Data da alocação</label>
                                        <div className="relative">
                                            <input
                                                type="date"
                                                value={displayDate}
                                                onChange={(e) => setDisplayDate(e.target.value)}
                                                className="bg-[#0f0f0f] border border-[#333333] text-white text-sm rounded-md pl-3 pr-2 py-2 focus:ring-1 focus:ring-[#6777FA] outline-none"
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleQuickUpdate}
                                        className="mt-5 px-6 py-2 bg-[#F7B748] hover:bg-[#F7B748]/90 text-black font-semibold rounded-full text-sm transition-colors flex items-center gap-2"
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
                                            // Pre-select type? Modal handles default.
                                        }}
                                        className="text-[#F7B748] hover:text-[#FFDBA0] text-sm font-medium flex items-center gap-1 transition-colors"
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
                                        className="text-[#F7B748] hover:text-[#FFDBA0] text-sm font-medium flex items-center gap-1 transition-colors"
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
                onSubmit={async (data) => {
                    // Reuse simulation creation logic? 
                    // Need to import useCreateSimulation from hooks
                    // For now, placeholder or quick fix import
                }}
                initialData={null}
            />
        </div>
    );
}
