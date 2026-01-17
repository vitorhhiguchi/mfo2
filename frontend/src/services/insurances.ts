import api from '@/lib/api';
import type { Insurance, CreateInsuranceInput } from '@/types';

export const insurancesService = {
    async getAll(simulationId: number): Promise<Insurance[]> {
        const { data } = await api.get<Insurance[]>(`/insurances?simulationId=${simulationId}`);
        return data;
    },

    async getById(id: number): Promise<Insurance> {
        const { data } = await api.get<Insurance>(`/insurances/${id}`);
        return data;
    },

    async create(input: CreateInsuranceInput): Promise<Insurance> {
        const { data } = await api.post<Insurance>('/insurances', input);
        return data;
    },

    async update(id: number, input: Partial<CreateInsuranceInput>): Promise<Insurance> {
        const { data } = await api.put<Insurance>(`/insurances/${id}`, input);
        return data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/insurances/${id}`);
    },
};
