import { buildApp } from '../../src/app';
import { FastifyInstance } from 'fastify';
import {
    createTestClient,
    createTestSimulation,
    createTestAsset
} from '../helpers';

describe('Asset Routes', () => {
    let app: FastifyInstance;

    beforeAll(async () => {
        app = await buildApp();
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /assets', () => {
        it('should create a new financial asset', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);

            const response = await app.inject({
                method: 'POST',
                url: '/assets',
                payload: {
                    name: 'Savings Account',
                    type: 'FINANCIAL',
                    simulationId: sim.id,
                    initialValue: 50000,
                    initialDate: '2024-01-01',
                },
            });

            expect(response.statusCode).toBe(201);
            const body = JSON.parse(response.body);
            expect(body.name).toBe('Savings Account');
            expect(body.type).toBe('FINANCIAL');
            expect(body.records).toHaveLength(1);
        });

        it('should create a real estate asset with financing', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);

            const response = await app.inject({
                method: 'POST',
                url: '/assets',
                payload: {
                    name: 'Apartment',
                    type: 'REAL_ESTATE',
                    simulationId: sim.id,
                    initialValue: 500000,
                    initialDate: '2024-01-01',
                    financing: {
                        startDate: '2024-01-01',
                        installments: 360,
                        interestRate: 0.08,
                        downPayment: 100000,
                    },
                },
            });

            expect(response.statusCode).toBe(201);
            const body = JSON.parse(response.body);
            expect(body.name).toBe('Apartment');
            expect(body.financing).not.toBeNull();
        });
    });

    describe('GET /assets', () => {
        it('should list assets for a simulation', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);
            await createTestAsset(sim.id, { name: 'Asset 1' });
            await createTestAsset(sim.id, { name: 'Asset 2' });

            const response = await app.inject({
                method: 'GET',
                url: `/assets?simulationId=${sim.id}`,
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body).toHaveLength(2);
        });
    });

    describe('GET /assets/:id', () => {
        it('should return an asset by id', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);
            const asset = await createTestAsset(sim.id, { name: 'My Asset' });

            const response = await app.inject({
                method: 'GET',
                url: `/assets/${asset!.id}`,
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.name).toBe('My Asset');
        });

        it('should return 404 for non-existent asset', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/assets/99999',
            });

            expect(response.statusCode).toBe(404);
        });
    });

    describe('PUT /assets/:id', () => {
        it('should update an asset name', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);
            const asset = await createTestAsset(sim.id, { name: 'Old Name' });

            const response = await app.inject({
                method: 'PUT',
                url: `/assets/${asset!.id}`,
                payload: { name: 'New Name' },
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.name).toBe('New Name');
        });
    });

    describe('DELETE /assets/:id', () => {
        it('should delete an asset', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);
            const asset = await createTestAsset(sim.id);

            const response = await app.inject({
                method: 'DELETE',
                url: `/assets/${asset!.id}`,
            });

            expect(response.statusCode).toBe(204);
        });
    });

    describe('POST /assets/:id/records', () => {
        it('should add a new record to an asset', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);
            const asset = await createTestAsset(sim.id);

            const response = await app.inject({
                method: 'POST',
                url: `/assets/${asset!.id}/records`,
                payload: {
                    value: 120000,
                    date: '2024-06-01',
                },
            });

            expect(response.statusCode).toBe(201);
            const body = JSON.parse(response.body);
            expect(body.value).toBe(120000);
        });
    });

    describe('GET /assets/:id/records', () => {
        it('should get all records for an asset', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);
            const asset = await createTestAsset(sim.id);

            const response = await app.inject({
                method: 'GET',
                url: `/assets/${asset!.id}/records`,
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('PUT /assets/:id/records/:recordId', () => {
        it('should update a specific record', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);
            const asset = await createTestAsset(sim.id);
            const recordId = asset!.records[0].id;

            const response = await app.inject({
                method: 'PUT',
                url: `/assets/${asset!.id}/records/${recordId}`,
                payload: {
                    value: 150000,
                },
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.value).toBe(150000);
        });
    });

    describe('POST /assets/:id/quick-update', () => {
        it('should add a record with current date', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);
            const asset = await createTestAsset(sim.id);

            const response = await app.inject({
                method: 'POST',
                url: `/assets/${asset!.id}/quick-update`,
                payload: {
                    value: 200000,
                },
            });

            expect(response.statusCode).toBe(201);
            const body = JSON.parse(response.body);
            expect(body.value).toBe(200000);
        });
    });
});
