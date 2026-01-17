import api from '@/lib/api';
import type { Movement, CreateMovementInput, MovementType } from '@/types';

export const movementsService = {
    async getAll(simulationId: number, type?: MovementType): Promise<Movement[]> {
        const params = new URLSearchParams();
        params.append('simulationId', String(simulationId));
        if (type) params.append('type', type);

        const { data } = await api.get<Movement[]>(`/movements?${params}`);
        return data;
    },

    async getById(id: number): Promise<Movement> {
        const { data } = await api.get<Movement>(`/movements/${id}`);
        return data;
    },

    async create(input: CreateMovementInput): Promise<Movement> {
        const { data } = await api.post<Movement>('/movements', input);
        return data;
    },

    async update(id: number, input: Partial<CreateMovementInput>): Promise<Movement> {
        const { data } = await api.put<Movement>(`/movements/${id}`, input);
        return data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/movements/${id}`);
    },
};
