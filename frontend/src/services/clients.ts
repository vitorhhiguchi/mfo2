import api from '@/lib/api';
import type { Client, CreateClientInput } from '@/types';

export const clientsService = {
    async getAll(): Promise<Client[]> {
        const { data } = await api.get<Client[]>('/clients');
        return data;
    },

    async getById(id: number): Promise<Client> {
        const { data } = await api.get<Client>(`/clients/${id}`);
        return data;
    },

    async create(input: CreateClientInput): Promise<Client> {
        const { data } = await api.post<Client>('/clients', input);
        return data;
    },

    async update(id: number, input: Partial<CreateClientInput>): Promise<Client> {
        const { data } = await api.put<Client>(`/clients/${id}`, input);
        return data;
    },

    async delete(id: number): Promise<void> {
        await api.delete(`/clients/${id}`);
    },
};
