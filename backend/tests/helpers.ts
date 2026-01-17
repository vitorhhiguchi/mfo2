import { prisma } from '../src/lib/prisma';
import type { Client, Simulation, Asset, Movement, Insurance, AssetType, MovementType, IncomeCategory, Frequency, InsuranceType } from '@prisma/client';

export async function createTestClient(data?: Partial<{ name: string; birthDate: Date }>): Promise<Client> {
    return prisma.client.create({
        data: {
            name: data?.name ?? 'Test Client',
            birthDate: data?.birthDate ?? new Date('1980-01-01'),
        },
    });
}

export async function createTestSimulation(
    clientId: number,
    data?: Partial<{ name: string; startDate: Date; realRate: number; version: number }>
): Promise<Simulation> {
    return prisma.simulation.create({
        data: {
            name: data?.name ?? 'Test Simulation',
            startDate: data?.startDate ?? new Date('2024-01-01'),
            realRate: data?.realRate ?? 0.04,
            clientId,
            version: data?.version ?? 1,
        },
    });
}

export async function createTestAsset(
    simulationId: number,
    data?: Partial<{ name: string; type: AssetType; initialValue: number; initialDate: Date }>
) {
    const asset = await prisma.asset.create({
        data: {
            name: data?.name ?? 'Test Asset',
            type: data?.type ?? 'FINANCIAL',
            simulationId,
        },
    });

    await prisma.assetRecord.create({
        data: {
            assetId: asset.id,
            value: data?.initialValue ?? 100000,
            date: data?.initialDate ?? new Date('2024-01-01'),
        },
    });

    return prisma.asset.findUnique({
        where: { id: asset.id },
        include: { records: true, financing: true },
    });
}

export async function createTestMovement(
    simulationId: number,
    data?: Partial<{ name: string; type: MovementType; category: IncomeCategory; value: number; frequency: Frequency; startDate: Date; endDate: Date | null }>
): Promise<Movement> {
    return prisma.movement.create({
        data: {
            name: data?.name ?? 'Test Movement',
            type: data?.type ?? 'INCOME',
            category: data?.category ?? 'WORK',
            value: data?.value ?? 10000,
            frequency: data?.frequency ?? 'MONTHLY',
            startDate: data?.startDate ?? new Date('2024-01-01'),
            endDate: data?.endDate ?? null,
            simulationId,
        },
    });
}

export async function createTestInsurance(
    simulationId: number,
    data?: Partial<{ name: string; type: InsuranceType; startDate: Date; durationMonths: number; premium: number; insuredValue: number }>
): Promise<Insurance> {
    return prisma.insurance.create({
        data: {
            name: data?.name ?? 'Test Insurance',
            type: data?.type ?? 'LIFE',
            startDate: data?.startDate ?? new Date('2024-01-01'),
            durationMonths: data?.durationMonths ?? 120,
            premium: data?.premium ?? 500,
            insuredValue: data?.insuredValue ?? 1000000,
            simulationId,
        },
    });
}

export async function cleanDatabase() {
    await prisma.insurance.deleteMany();
    await prisma.movement.deleteMany();
    await prisma.financing.deleteMany();
    await prisma.assetRecord.deleteMany();
    await prisma.asset.deleteMany();
    await prisma.simulation.deleteMany();
    await prisma.client.deleteMany();
}
