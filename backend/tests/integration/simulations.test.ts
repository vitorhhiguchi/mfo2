import { buildApp } from '../../src/app';
import { FastifyInstance } from 'fastify';
import {
    createTestClient,
    createTestSimulation,
    createTestAsset,
    createTestMovement,
    createTestInsurance,
    cleanDatabase
} from '../helpers';
import { prisma } from '../../src/lib/prisma';

describe('Simulation Routes', () => {
    let app: FastifyInstance;

    beforeAll(async () => {
        app = await buildApp();
        await app.ready();
    });

    beforeEach(async () => {
        await cleanDatabase();
    });

    afterAll(async () => {
        await app.close();
    });

    describe('POST /simulations', () => {
        it('should create a new simulation', async () => {
            const client = await createTestClient();

            const response = await app.inject({
                method: 'POST',
                url: '/simulations',
                payload: {
                    name: 'Plano Original',
                    startDate: '2024-01-01',
                    realRate: 0.04,
                    clientId: client.id,
                },
            });

            expect(response.statusCode).toBe(201);
            const body = JSON.parse(response.body);
            expect(body.name).toBe('Plano Original');
            expect(body.realRate).toBe(0.04);
        });

        it('should not allow duplicate names for same client', async () => {
            const client = await createTestClient();
            await createTestSimulation(client.id, { name: 'Plano Original' });

            const response = await app.inject({
                method: 'POST',
                url: '/simulations',
                payload: {
                    name: 'Plano Original',
                    startDate: '2024-01-01',
                    clientId: client.id,
                },
            });

            expect(response.statusCode).toBe(400);
        });
    });

    describe('GET /simulations', () => {
        it('should return only latest versions by default', async () => {
            const client = await createTestClient();
            await createTestSimulation(client.id, { name: 'Sim1', version: 1 });
            await createTestSimulation(client.id, { name: 'Sim1', version: 2 });
            await createTestSimulation(client.id, { name: 'Sim2', version: 1 });

            const response = await app.inject({
                method: 'GET',
                url: `/simulations?clientId=${client.id}`,
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body).toHaveLength(2);
        });

        it('should return all versions when requested', async () => {
            const client = await createTestClient();
            await createTestSimulation(client.id, { name: 'Sim1', version: 1 });
            await createTestSimulation(client.id, { name: 'Sim1', version: 2 });

            const response = await app.inject({
                method: 'GET',
                url: `/simulations?clientId=${client.id}&includeAllVersions=true`,
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body).toHaveLength(2);
        });
    });

    describe('GET /simulations/:id', () => {
        it('should return a simulation by id', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id, { name: 'Test Sim' });

            const response = await app.inject({
                method: 'GET',
                url: `/simulations/${sim.id}`,
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.name).toBe('Test Sim');
        });

        it('should return 404 for non-existent simulation', async () => {
            const response = await app.inject({
                method: 'GET',
                url: '/simulations/99999',
            });

            expect(response.statusCode).toBe(404);
        });
    });

    describe('PUT /simulations/:id', () => {
        it('should update a simulation', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id, { name: 'Old Name' });

            const response = await app.inject({
                method: 'PUT',
                url: `/simulations/${sim.id}`,
                payload: {
                    name: 'New Name',
                    realRate: 0.05,
                },
            });

            expect(response.statusCode).toBe(200);
            const body = JSON.parse(response.body);
            expect(body.name).toBe('New Name');
            expect(body.realRate).toBe(0.05);
        });

        it('should not allow updating current situation simulation', async () => {
            const client = await createTestClient();
            await prisma.simulation.create({
                data: {
                    name: 'Situação Atual',
                    startDate: new Date(),
                    realRate: 0.04,
                    clientId: client.id,
                    isCurrentSituation: true,
                },
            });
            const currentSim = await prisma.simulation.findFirst({
                where: { clientId: client.id, isCurrentSituation: true },
            });

            const response = await app.inject({
                method: 'PUT',
                url: `/simulations/${currentSim!.id}`,
                payload: {
                    name: 'New Name',
                },
            });

            expect(response.statusCode).toBe(400);
        });

        it('should return 404 for non-existent simulation', async () => {
            const response = await app.inject({
                method: 'PUT',
                url: '/simulations/99999',
                payload: { name: 'Test' },
            });

            expect(response.statusCode).toBe(400);
        });
    });

    describe('DELETE /simulations/:id', () => {
        it('should delete a simulation', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id);

            const response = await app.inject({
                method: 'DELETE',
                url: `/simulations/${sim.id}`,
            });

            expect(response.statusCode).toBe(204);

            const getResponse = await app.inject({
                method: 'GET',
                url: `/simulations/${sim.id}`,
            });
            expect(getResponse.statusCode).toBe(404);
        });

        it('should not allow deleting current situation simulation', async () => {
            const client = await createTestClient();
            await prisma.simulation.create({
                data: {
                    name: 'Situação Atual',
                    startDate: new Date(),
                    realRate: 0.04,
                    clientId: client.id,
                    isCurrentSituation: true,
                },
            });
            const currentSim = await prisma.simulation.findFirst({
                where: { clientId: client.id, isCurrentSituation: true },
            });

            const response = await app.inject({
                method: 'DELETE',
                url: `/simulations/${currentSim!.id}`,
            });

            expect(response.statusCode).toBe(400);
        });

        it('should return 404 for non-existent simulation', async () => {
            const response = await app.inject({
                method: 'DELETE',
                url: '/simulations/99999',
            });

            expect(response.statusCode).toBe(400);
        });
    });

    describe('POST /simulations/:id/version', () => {
        it('should create a new version', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id, { name: 'Plano', version: 1 });
            await createTestAsset(sim.id);
            await createTestMovement(sim.id);
            await createTestInsurance(sim.id);

            const response = await app.inject({
                method: 'POST',
                url: `/simulations/${sim.id}/version`,
            });

            expect(response.statusCode).toBe(201);
            const body = JSON.parse(response.body);
            expect(body.name).toBe('Plano');
            expect(body.version).toBe(2);
        });

        it('should return 404 for non-existent simulation', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/simulations/99999/version',
            });

            expect(response.statusCode).toBe(400);
        });
    });

    describe('POST /simulations/:id/duplicate', () => {
        it('should duplicate with new name', async () => {
            const client = await createTestClient();
            const sim = await createTestSimulation(client.id, { name: 'Original' });
            await createTestAsset(sim.id);
            await createTestMovement(sim.id);
            await createTestInsurance(sim.id);

            const response = await app.inject({
                method: 'POST',
                url: `/simulations/${sim.id}/duplicate`,
                payload: {
                    name: 'Novo Plano',
                },
            });

            expect(response.statusCode).toBe(201);
            const body = JSON.parse(response.body);
            expect(body.name).toBe('Novo Plano');
            expect(body.version).toBe(1);
        });

        it('should not allow duplicate to existing name', async () => {
            const client = await createTestClient();
            await createTestSimulation(client.id, { name: 'Existing' });
            const sim = await createTestSimulation(client.id, { name: 'Original' });

            const response = await app.inject({
                method: 'POST',
                url: `/simulations/${sim.id}/duplicate`,
                payload: {
                    name: 'Existing',
                },
            });

            expect(response.statusCode).toBe(400);
        });

        it('should return 404 for non-existent simulation', async () => {
            const response = await app.inject({
                method: 'POST',
                url: '/simulations/99999/duplicate',
                payload: { name: 'Test' },
            });

            expect(response.statusCode).toBe(400);
        });
    });
});

