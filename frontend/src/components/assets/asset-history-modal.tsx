import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Asset, AssetRecord } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { assetsService } from '@/services/assets';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, Save, X } from 'lucide-react';

interface AssetHistoryModalProps {
    asset: Asset | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AssetHistoryModal({ asset, open, onOpenChange }: AssetHistoryModalProps) {
    const [newRecordDate, setNewRecordDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [newRecordValue, setNewRecordValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Inline Editing
    const [editingRecordId, setEditingRecordId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState('');

    const queryClient = useQueryClient();

    if (!asset) return null;

    const sortedRecords = [...(asset.records || [])].sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const chartData = sortedRecords.map(r => ({
        date: format(parseISO(r.date), 'dd/MM/yyyy'),
        value: r.value,
        timestamp: new Date(r.date).getTime()
    }));

    const handleAddRecord = async () => {
        if (!newRecordValue || !newRecordDate) return;

        try {
            setIsLoading(true);
            await assetsService.addRecord(asset.id, parseFloat(newRecordValue), newRecordDate);
            await queryClient.invalidateQueries({ queryKey: ['assets', asset.simulationId] });

            setNewRecordValue('');
            setNewRecordDate(format(new Date(), 'yyyy-MM-dd'));
            toast.success('Registro adicionado!');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao adicionar registro');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateRecord = async (record: AssetRecord) => {
        try {
            setIsLoading(true);
            await assetsService.updateRecord(asset.id, record.id, parseFloat(editValue));
            await queryClient.invalidateQueries({ queryKey: ['assets', asset.simulationId] });

            setEditingRecordId(null);
            setEditValue('');
            toast.success('Registro atualizado!');
        } catch (error) {
            console.error(error);
            toast.error('Erro ao atualizar registro');
        } finally {
            setIsLoading(false);
        }
    };

    const startEditing = (record: AssetRecord) => {
        setEditingRecordId(record.id);
        setEditValue(record.value.toString());
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] bg-[#1a1a1a] border-[#333333] text-foreground max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{asset.name} - Histórico</DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Chart */}
                    <div className="h-[250px] w-full bg-black/20 rounded-lg p-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis
                                    dataKey="date"
                                    stroke="#666"
                                    fontSize={12}
                                    tickMargin={10}
                                />
                                <YAxis
                                    stroke="#666"
                                    fontSize={12}
                                    tickFormatter={(val) => `R$ ${val / 1000}k`}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f1f1f', borderColor: '#333' }}
                                    formatter={(val: number) => formatCurrency(val)}
                                    labelStyle={{ color: '#888' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={asset.type === 'REAL_ESTATE' ? '#03B6AD' : '#6777FA'}
                                    strokeWidth={2}
                                    dot={{ fill: '#1f1f1f', strokeWidth: 2 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Add New Record */}
                    <div className="bg-black/20 p-4 rounded-lg space-y-3">
                        <Label className="text-sm font-medium">Adicionar Registro Manual</Label>
                        <div className="flex gap-2">
                            <Input
                                type="date"
                                value={newRecordDate}
                                onChange={(e) => setNewRecordDate(e.target.value)}
                                className="bg-[#1a1a1a] border-[#333] w-auto"
                            />
                            <Input
                                type="number"
                                placeholder="Valor (R$)"
                                value={newRecordValue}
                                onChange={(e) => setNewRecordValue(e.target.value)}
                                className="bg-[#1a1a1a] border-[#333]"
                            />
                            <Button
                                onClick={handleAddRecord}
                                disabled={isLoading || !newRecordValue}
                                className="bg-[#262626] hover:bg-[#333]"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Adicionar
                            </Button>
                        </div>
                    </div>

                    {/* Records List */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium">Histórico de Valores</Label>
                        <div className="border border-[#333] rounded-lg overflow-hidden">
                            <div className="max-h-[200px] overflow-y-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-black/40 text-muted-foreground sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2 text-left font-medium">Data</th>
                                            <th className="px-4 py-2 text-left font-medium">Valor</th>
                                            <th className="px-4 py-2 text-right font-medium">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#333]">
                                        {[...sortedRecords].reverse().map((record) => (
                                            <tr key={record.id} className="hover:bg-white/5 bg-[#1a1a1a]">
                                                <td className="px-4 py-2">
                                                    {format(parseISO(record.date), 'dd/MM/yyyy')}
                                                </td>
                                                <td className="px-4 py-2 font-medium">
                                                    {editingRecordId === record.id ? (
                                                        <Input
                                                            type="number"
                                                            value={editValue}
                                                            onChange={(e) => setEditValue(e.target.value)}
                                                            className="h-7 w-[120px] bg-black/20 border-[#333]"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        formatCurrency(record.value)
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-right">
                                                    {editingRecordId === record.id ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <button
                                                                onClick={() => handleUpdateRecord(record)}
                                                                disabled={isLoading}
                                                                className="p-1 hover:text-green-400 text-green-600 transition-colors"
                                                            >
                                                                <Save className="h-4 w-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingRecordId(null)}
                                                                className="p-1 hover:text-red-400 text-muted-foreground transition-colors"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            onClick={() => startEditing(record)}
                                                            className="p-1 hover:text-white text-muted-foreground transition-colors opacity-0 group-hover:opacity-100"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
