import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMssql } from "@prisma/adapter-mssql";

const connectionString = process.env.DB_URL;

const globalForPrisma = global as unknown as {
    prisma: PrismaClient;
};

function createPrismaClient() {
    if (!connectionString) {
        throw new Error("DB_URL not found in environment.");
    }
    const adapter = new PrismaMssql(connectionString);
    return new PrismaClient({ adapter });
}

export const prisma =
    globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

