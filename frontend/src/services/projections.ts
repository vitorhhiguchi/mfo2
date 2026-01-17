import api from '@/lib/api';
import type { ProjectionResult, ProjectionInput, LifeStatus } from '@/types';

export const projectionsService = {
    async generate(input: ProjectionInput): Promise<ProjectionResult> {
        const { data } = await api.post<ProjectionResult>('/projections', input);
        return data;
    },

    async compare(
        simulationIds: number[],
        endYear: number,
        lifeStatus?: LifeStatus
    ): Promise<{ simulations: ProjectionResult[] }> {
        const { data } = await api.post<{ simulations: ProjectionResult[] }>('/projections/compare', {
            simulationIds,
            endYear,
            lifeStatus,
        });
        return data;
    },
};
