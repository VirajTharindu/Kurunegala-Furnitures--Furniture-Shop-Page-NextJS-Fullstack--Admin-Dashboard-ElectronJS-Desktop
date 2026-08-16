import { prisma } from "@/lib/prisma";
import { fetchWithCache } from "@/lib/cache";
import { invalidatePattern } from "@/lib/redis";
import type { Product } from "@/generated/prisma/client";

//fetch all products
export async function getAllProducts(skip: number, limit: number): Promise<Product[]> {
    const key = `product:${skip}:${limit}`;
    const ttl = 3600
    return fetchWithCache(key, ttl, () => prisma.product.findMany({
        skip,
        take: limit,
        orderBy: {
            createdAt: "desc"
        }

    }))
}

//fetch 1 product by ID
export async function getProductById(id: string): Promise<Product | null> {
    const key = `product:${id}`;
    const ttl = 3600; //1 hour
    return fetchWithCache(key, ttl, () =>
        prisma.product.findUnique({ where: { id } }));

}

//create a new product
export async function createProduct(data: Omit<Product, "id" | "createdAt" | "updatedAt">): Promise<Product> {
    const product = await prisma.product.create({ data });
    await invalidatePattern(`product:*`);
    return product;
}

//update an existing product
export async function updateProduct(id: string, updates: Partial<Omit<Product, "id" | "createdAt" | "updatedAt">>): Promise<Product> {
    const updated = await prisma.product.update({ where: { id }, data: updates });

    //remove stale cache entries
    await invalidatePattern(`product:${id}`);
    await invalidatePattern(`product:*`);

    return updated;
}

//delete product
export async function deleteProduct(id: string): Promise<boolean> {
    try {
        await prisma.product.delete({ where: { id } });
        await invalidatePattern(`product:*`);
        return true;
    }

    catch (error) {
        console.error("Error deleting product:", error);
        return false;
    }

}
