import api from '@/lib/api';
import type { Simulation, CreateSimulationInput } from '@/types';

export const simulationsService = {
    async getAll(clientId?: number, includeAllVersions = false): Promise<Simulation[]> {
        const params = new URLSearchParams();
        if (clientId) params.append('clientId', String(clientId));
        if (includeAllVersions) params.append('includeAllVersions', 'true');

        const { data } = await api.get<Simulation[]>(`/simulations?${params}`);
        return data;
    },

    async getById(id: number): Promise<Simulation> {
        const { data } = await api.get<Simulation>(`/simulations/${id}`);
        return data;
    },

    async create(input: CreateSimulationInput): Promise<Simulation> {
        const { data } = await api.post<Simulation>('/simulations', input);
        return data;
    },

    async update(id: number, input: Partial<CreateSimulationInput>): Promise<Simulation> {
        const { data } = await api.put<Simulation>(`/simulations/${id}`, input);
        return data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/simulations/${id}`);
    },

    async createVersion(id: number): Promise<Simulation> {
        const { data } = await api.post<Simulation>(`/simulations/${id}/version`);
        return data;
    },

    async duplicate(id: number, name: string): Promise<Simulation> {
        const { data } = await api.post<Simulation>(`/simulations/${id}/duplicate`, { name });
        return data;
    },
};
