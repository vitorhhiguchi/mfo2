import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { assetsService } from '@/services/assets';
import type { CreateAssetInput, Asset } from '@/types';
import { toast } from 'sonner';

export const useAssets = (simulationId: number | undefined) => {
    const queryClient = useQueryClient();

    // Fetch assets
    const { data: assets, isLoading, error } = useQuery({
        queryKey: ['assets', simulationId],
        queryFn: () => assetsService.getAll(simulationId!),
        enabled: !!simulationId,
    });

    // Create asset
    const createAsset = useMutation({
        mutationFn: (data: CreateAssetInput) => assetsService.create(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets', simulationId] });
            queryClient.invalidateQueries({ queryKey: ['projections'] }); // Invalidate projections as assets affect them
            toast.success('Ativo criado com sucesso!');
        },
        onError: (error) => {
            toast.error('Erro ao criar ativo');
            console.error(error);
        },
    });

    // Update asset
    const updateAsset = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<CreateAssetInput> }) =>
            assetsService.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets', simulationId] });
            queryClient.invalidateQueries({ queryKey: ['projections'] });
            toast.success('Ativo atualizado com sucesso!');
        },
        onError: (error) => {
            toast.error('Erro ao atualizar ativo');
            console.error(error);
        },
    });

    // Delete asset
    const deleteAsset = useMutation({
        mutationFn: (id: number) => assetsService.delete(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets', simulationId] });
            queryClient.invalidateQueries({ queryKey: ['projections'] });
            toast.success('Ativo excluído com sucesso!');
        },
        onError: (error) => {
            toast.error('Erro ao excluir ativo');
            console.error(error);
        },
    });

    // Quick Update (Update value for today)
    const quickUpdateAsset = useMutation({
        mutationFn: ({ id, value }: { id: number; value: number }) =>
            assetsService.quickUpdate(id, value),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['assets', simulationId] });
            queryClient.invalidateQueries({ queryKey: ['projections'] });
            toast.success('Valor atualizado com sucesso!');
        },
        onError: (error) => {
            toast.error('Erro ao atualizar valor');
            console.error(error);
        },
    });

    return {
        assets,
        isLoading,
        error,
        createAsset,
        updateAsset,
        deleteAsset,
        quickUpdateAsset,
    };
};
