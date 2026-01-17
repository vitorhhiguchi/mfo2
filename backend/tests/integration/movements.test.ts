import { buildApp } from '../../src/app';
import { FastifyInstance } from 'fastify';
import {
    createTestClient,
    createTestSimulation,
    createTestMovement
} from '../helpers';

describe('Movement Routes', () => {
    let app: FastifyInstance;

    beforeAll(async () => {
        app = await buildApp();
        await app.ready();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /movements', () => {
        it('should create a new income movement', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);

            const response = await app.inject({
                method: 'POST',
                url: '/movements',
                payload: {
                    name: 'Salary',
                    type: 'INCOME',
                    category: 'WORK',
                    value: 15000,
                    frequency: 'MONTHLY',
                    startDate: '2024-01-01',
                    endDate: '2035-12-31',
                    simulationId: sim.id,
                },
            });

            expect(response.statusCode).toBe(201);
            const body = JSON.parse(response.body);
            expect(body.name).toBe('Salary');
            expect(body.type).toBe('INCOME');
        });

        it('should create a new expense movement', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);

            const response = await app.inject({
                method: 'POST',
                url: '/movements',
                payload: {
                    name: 'Living Expenses',
                    type: 'EXPENSE',
                    value: 5000,
                    frequency: 'MONTHLY',
                    startDate: '2024-01-01',
                    simulationId: sim.id,
                },
            });

            expect(response.statusCode).toBe(201);
            const body = JSON.parse(response.body);
            expect(body.type).toBe('EXPENSE');
        });
    });

    describe('GET /movements', () => {
        it('should list movements for a simulation', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);
            await createTestMovement(sim.id, { name: 'Income 1', type: 'INCOME' });
            await createTestMovement(sim.id, { name: 'Expense 1', type: 'EXPENSE' });

            const response = await app.inject({
                method: 'GET',
                url: `/movements?simulationId=${sim.id}`,
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body).toHaveLength(2);
        });

        it('should filter movements by type', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);
            await createTestMovement(sim.id, { type: 'INCOME' });
            await createTestMovement(sim.id, { type: 'EXPENSE' });

            const response = await app.inject({
                method: 'GET',
                url: `/movements?simulationId=${sim.id}&type=INCOME`,
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body).toHaveLength(1);
            expect(body[0].type).toBe('INCOME');
        });
    });

    describe('GET /movements/:id', () => {
        it('should return a movement by id', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);
            const movement = await createTestMovement(sim.id, { name: 'Test Movement' });

            const response = await app.inject({
                method: 'GET',
                url: `/movements/${movement.id}`,
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.name).toBe('Test Movement');
        });

        it('should return 404 for non-existent movement', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/movements/99999',
            });

            expect(response.statusCode).toBe(404);
        });
    });

    describe('PUT /movements/:id', () => {
        it('should update a movement', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);
            const movement = await createTestMovement(sim.id, { value: 10000 });

            const response = await app.inject({
                method: 'PUT',
                url: `/movements/${movement.id}`,
                payload: {
                    value: 15000,
                    name: 'Updated Name',
                },
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.value).toBe(15000);
            expect(body.name).toBe('Updated Name');
        });
    });

    describe('DELETE /movements/:id', () => {
        it('should delete a movement', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);
            const movement = await createTestMovement(sim.id);

            const response = await app.inject({
                method: 'DELETE',
                url: `/movements/${movement.id}`,
            });

            expect(response.statusCode).toBe(204);

            const getResponse = await app.inject({
                method: 'GET',
                url: `/movements/${movement.id}`,
            });

            expect(getResponse.statusCode).toBe(404);
        });
    });
});
