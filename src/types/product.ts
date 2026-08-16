import type { Product as PrismaProduct } from "@/generated/prisma/client";

/**
 * Frontend Product type.
 *
 * The Prisma-generated `Product` type stores `tags` and `specs` as raw strings
 * (because MSSQL has no native JSON/Array columns). The API route's
 * `mapToFrontendProduct` helper parses them before sending the response,
 * so on the client side they arrive as structured objects.
 *
 * Use this type in any component that consumes the API response.
 * Use the Prisma `Product` type only in server-side / DAO code.
 */

export interface ProductSpecs {
    width: number;
    height: number;
    depth: number;
    weight: number;
    material: string;
}

export type FrontendProduct = Omit<PrismaProduct, "tags" | "specs" | "price"> & {
    tags: string[];
    specs: ProductSpecs;
    price: number; // Prisma Decimal → number after mapToFrontendProduct
};
