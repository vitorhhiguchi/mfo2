import { prisma } from '../src/lib/prisma';

beforeAll(async () => {
    // Ensure database connection
    await prisma.$connect();
});

beforeEach(async () => {
    // Clean database before each test in order of dependencies
    await prisma.insurance.deleteMany();
    await prisma.movement.deleteMany();
    await prisma.financing.deleteMany();
    await prisma.assetRecord.deleteMany();
    await prisma.asset.deleteMany();
    await prisma.simulation.deleteMany();
    await prisma.client.deleteMany();
});

afterAll(async () => {
    await prisma.$disconnect();
});
