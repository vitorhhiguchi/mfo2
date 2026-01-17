import api from '@/lib/api';
import type { Asset, AssetRecord, CreateAssetInput } from '@/types';

export const assetsService = {
    async getAll(simulationId: number): Promise<Asset[]> {
        const { data } = await api.get<Asset[]>(`/assets?simulationId=${simulationId}`);
        return data;
    },

    async getById(id: number): Promise<Asset> {
        const { data } = await api.get<Asset>(`/assets/${id}`);
        return data;
    },

    async create(input: CreateAssetInput): Promise<Asset> {
        const { data } = await api.post<Asset>('/assets', input);
        return data;
    },

    async update(id: number, input: Partial<CreateAssetInput>): Promise<Asset> {
        const { data } = await api.put<Asset>(`/assets/${id}`, input);
        return data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/assets/${id}`);
    },

    // Records
    async getRecords(assetId: number): Promise<AssetRecord[]> {
        const { data } = await api.get<AssetRecord[]>(`/assets/${assetId}/records`);
        return data;
    },

    async addRecord(assetId: number, value: number, date: string): Promise<AssetRecord> {
        const { data } = await api.post<AssetRecord>(`/assets/${assetId}/records`, { value, date });
        return data;
    },

    async updateRecord(assetId: number, recordId: number, value: number): Promise<AssetRecord> {
        const { data } = await api.put<AssetRecord>(`/assets/${assetId}/records/${recordId}`, { value });
        return data;
    },

    async quickUpdate(assetId: number, value: number): Promise<AssetRecord> {
        const { data } = await api.post<AssetRecord>(`/assets/${assetId}/quick-update`, { value });
        return data;
    },
};
