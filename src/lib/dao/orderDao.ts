import { prisma } from "@/lib/prisma";
import { fetchWithCache } from "@/lib/cache";
import type { Order } from "@/generated/prisma/client";
import { Prisma } from "@/generated/prisma/client";
import { invalidatePattern } from "@/lib/redis";

// fetch all orders
export async function getAllOrders(): Promise<Order[]> {
    const key = "orders:all";
    const ttl = 300; // 5 minutes
    return fetchWithCache(key, ttl, () =>
        prisma.order.findMany({
            include: { user: true, items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        })
    );
}

// fetch orders by user ID
export async function getOrdersByUserId(userId: string): Promise<Order[]> {
    const key = `orders:user:${userId}`;
    const ttl = 300;
    return fetchWithCache(key, ttl, () =>
        prisma.order.findMany({
            where: { userId },
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: 'desc' }
        })
    );
}

// fetch 1 order by ID
export async function getOrderById(id: string): Promise<Order | null> {
    const key = `order:${id}`;
    const ttl = 300;
    return fetchWithCache(key, ttl, () =>
        prisma.order.findUnique({
            where: { id },
            include: { user: true, items: { include: { product: true } } }
        })
    );
}

// create a new order (with items)
export async function createOrder(
    userId: string,
    totalAmount: Prisma.Decimal | number | string,
    items: { productId: string, quantity: number, unitPrice: Prisma.Decimal | number | string }[]
): Promise<Order> {
    const order = await prisma.order.create({
        data: {
            userId,
            totalAmount,
            status: "PENDING",
            items: {
                create: items
            }
        },
        include: { items: true }
    });

    // Invalidate caches
    await invalidatePattern("orders:all");
    await invalidatePattern(`orders:user:${userId}`);

    return order;
}

// update order status
export async function updateOrderStatus(id: string, status: string): Promise<Order> {
    const order = await prisma.order.update({
        where: { id },
        data: { status }
    });

    await invalidatePattern(`order:${id}`);
    await invalidatePattern(`orders:user:${order.userId}`);
    await invalidatePattern("orders:all");
    return order;
}

// delete order
export async function deleteOrder(id: string): Promise<boolean> {
    try {
        // Fetch the order first to get the userId for cache invalidation
        const order = await prisma.order.findUnique({ where: { id } });

        // Delete related OrderItems first
        await prisma.orderItem.deleteMany({ where: { orderId: id } });
        await prisma.order.delete({ where: { id } });

        await invalidatePattern(`order:${id}`);
        await invalidatePattern("orders:all");
        if (order) await invalidatePattern(`orders:user:${order.userId}`);

        return true;
    } catch (error) {
        console.error("Error deleting order:", error);
        return false;
    }
}
