import { prisma } from "@/lib/prisma";
import type { OrderItem } from "@/generated/prisma/client";
import { invalidatePattern } from "@/lib/redis";

// fetch order items by order ID
export async function getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    return prisma.orderItem.findMany({
        where: { orderId },
        include: { product: true }
    });
}

// update an order item (e.g., if adjustments are needed)
export async function updateOrderItem(id: string, updates: Partial<Omit<OrderItem, "id" | "createdAt" | "updatedAt">>): Promise<OrderItem> {
    const item = await prisma.orderItem.update({
        where: { id },
        data: updates,
        include: { order: true }
    });

    await invalidatePattern(`order:${item.orderId}`);
    await invalidatePattern("orders:all");
    await invalidatePattern(`orders:user:${item.order.userId}`);

    return item;
}

// remove an order item
export async function removeOrderItem(id: string): Promise<boolean> {
    try {
        const item = await prisma.orderItem.findUnique({ where: { id }, include: { order: true } });
        if (item) {
            await prisma.orderItem.delete({ where: { id } });

            await invalidatePattern(`order:${item.orderId}`);
            await invalidatePattern("orders:all");
            await invalidatePattern(`orders:user:${item.order.userId}`);
        }
        return true;
    } catch (error) {
        console.error("Error deleting order item:", error);
        return false;
    }
}
