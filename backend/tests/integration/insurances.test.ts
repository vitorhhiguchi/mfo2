import { buildApp } from '../../src/app';
import { FastifyInstance } from 'fastify';
import {
    createTestClient,
    createTestSimulation,
    createTestInsurance
} from '../helpers';

describe('Insurance Routes', () => {
    let app: FastifyInstance;

    beforeAll(async () => {
        app = await buildApp();
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /insurances', () => {
        it('should create a new life insurance', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);

            const response = await app.inject({
                method: 'POST',
                url: '/insurances',
                payload: {
                    name: 'Life Insurance',
                    type: 'LIFE',
                    startDate: '2024-01-01',
                    durationMonths: 120,
                    premium: 500,
                    insuredValue: 1000000,
                    simulationId: sim.id,
                },
            });

            expect(response.statusCode).toBe(201);
            const body = JSON.parse(response.body);
            expect(body.name).toBe('Life Insurance');
            expect(body.type).toBe('LIFE');
            expect(body.insuredValue).toBe(1000000);
        });

        it('should create a disability insurance', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);

            const response = await app.inject({
                method: 'POST',
                url: '/insurances',
                payload: {
                    name: 'Disability',
                    type: 'DISABILITY',
                    startDate: '2024-01-01',
                    durationMonths: 60,
                    premium: 300,
                    insuredValue: 500000,
                    simulationId: sim.id,
                },
            });

            expect(response.statusCode).toBe(201);
            const body = JSON.parse(response.body);
            expect(body.type).toBe('DISABILITY');
        });
    });

    describe('GET /insurances', () => {
        it('should list insurances for a simulation', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);
            await createTestInsurance(sim.id, { name: 'Insurance 1' });
            await createTestInsurance(sim.id, { name: 'Insurance 2' });

            const response = await app.inject({
                method: 'GET',
                url: `/insurances?simulationId=${sim.id}`,
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body).toHaveLength(2);
        });
    });

    describe('GET /insurances/:id', () => {
        it('should return an insurance by id', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);
            const insurance = await createTestInsurance(sim.id, { name: 'Test Insurance' });

            const response = await app.inject({
                method: 'GET',
                url: `/insurances/${insurance.id}`,
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.name).toBe('Test Insurance');
        });

        it('should return 404 for non-existent insurance', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/insurances/99999',
            });

            expect(response.statusCode).toBe(404);
        });
    });

    describe('PUT /insurances/:id', () => {
        it('should update an insurance', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);
            const insurance = await createTestInsurance(sim.id, { premium: 500 });

            const response = await app.inject({
                method: 'PUT',
                url: `/insurances/${insurance.id}`,
                payload: {
                    premium: 600,
                    name: 'Updated Insurance',
                },
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.premium).toBe(600);
            expect(body.name).toBe('Updated Insurance');
        });
    });

    describe('DELETE /insurances/:id', () => {
        it('should delete an insurance', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);
            const insurance = await createTestInsurance(sim.id);

            const response = await app.inject({
                method: 'DELETE',
                url: `/insurances/${insurance.id}`,
            });

            expect(response.statusCode).toBe(204);

            const getResponse = await app.inject({
                method: 'GET',
                url: `/insurances/${insurance.id}`,
            });

            expect(getResponse.statusCode).toBe(404);
        });
    });
});
