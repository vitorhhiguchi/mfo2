import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Asset } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { useAssets } from '@/hooks';
import { toast } from 'sonner';

interface QuickUpdateModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    assets: Asset[];
    simulationId: number;
}

export function QuickUpdateModal({ open, onOpenChange, assets, simulationId }: QuickUpdateModalProps) {
    const [updates, setUpdates] = useState<Record<number, string>>({});
    const [isLoading, setIsLoading] = useState(false);

    const { quickUpdateAsset } = useAssets(simulationId);

    // Initialize with current values
    useEffect(() => {
        if (open) {
            const initialUpdates: Record<number, string> = {};
            assets.forEach(asset => {
                const lastRecord = asset.records?.[asset.records.length - 1];
                if (lastRecord) {
                    initialUpdates[asset.id] = lastRecord.value.toString();
                }
            });
            setUpdates(initialUpdates);
        }
    }, [open, assets]);

    const handleValueChange = (assetId: number, value: string) => {
        setUpdates(prev => ({ ...prev, [assetId]: value }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            const promises = Object.entries(updates).map(([assetId, valueStr]) => {
                const asset = assets.find(a => a.id === parseInt(assetId));
                if (!asset) return Promise.resolve();

                const newValue = parseFloat(valueStr);
                const lastRecord = asset.records?.[asset.records.length - 1];
                const lastValue = lastRecord ? lastRecord.value : 0;

                // Only update if value changed
                if (newValue !== lastValue) {
                    return quickUpdateAsset.mutateAsync({
                        id: parseInt(assetId),
                        value: newValue
                    });
                }
                return Promise.resolve();
            });

            await Promise.all(promises);
            toast.success("Atualização realizada com sucesso!");
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao realizar atualização em massa.");
        } finally {
            setIsLoading(false);
        }
    };

    const financialAssets = assets.filter(a => a.type === 'FINANCIAL');
    const realEstateAssets = assets.filter(a => a.type === 'REAL_ESTATE');

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] bg-[#1a1a1a] border-[#333333] text-foreground max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Atualizar Posição Patrimonial ({format(new Date(), 'dd/MM/yyyy')})</DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Financial */}
                    {financialAssets.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-[#6777FA]">Financeiros</h3>
                            <div className="space-y-3">
                                {financialAssets.map(asset => (
                                    <div key={asset.id} className="grid grid-cols-[1fr,150px] items-center gap-4 bg-black/20 p-3 rounded-md border border-[#333]">
                                        <div>
                                            <div className="font-medium text-sm">{asset.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                Atual: {formatCurrency(asset.records?.[asset.records.length - 1]?.value || 0)}
                                            </div>
                                        </div>
                                        <Input
                                            type="number"
                                            value={updates[asset.id] || ''}
                                            onChange={(e) => handleValueChange(asset.id, e.target.value)}
                                            className="bg-[#1a1a1a] border-[#333] h-9"
                                            placeholder="Novo valor"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Real Estate */}
                    {realEstateAssets.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold text-[#03B6AD]">Imóveis</h3>
                            <div className="space-y-3">
                                {realEstateAssets.map(asset => (
                                    <div key={asset.id} className="grid grid-cols-[1fr,150px] items-center gap-4 bg-black/20 p-3 rounded-md border border-[#333]">
                                        <div>
                                            <div className="font-medium text-sm">{asset.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                Atual: {formatCurrency(asset.records?.[asset.records.length - 1]?.value || 0)}
                                            </div>
                                        </div>
                                        <Input
                                            type="number"
                                            value={updates[asset.id] || ''}
                                            onChange={(e) => handleValueChange(asset.id, e.target.value)}
                                            className="bg-[#1a1a1a] border-[#333] h-9"
                                            placeholder="Novo valor"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
                    <Button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="bg-[#FF9343] hover:bg-[#FF9343]/90 text-black"
                    >
                        {isLoading ? 'Salvando...' : 'Confirmar Atualização'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
