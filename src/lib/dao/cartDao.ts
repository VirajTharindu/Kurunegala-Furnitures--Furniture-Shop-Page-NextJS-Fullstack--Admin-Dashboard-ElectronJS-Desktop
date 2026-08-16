import { prisma } from "@/lib/prisma";
import { fetchWithCache } from "@/lib/cache";
import type { Cart } from "@/generated/prisma/client";
import { invalidatePattern } from "@/lib/redis";

// fetch cart by user ID
export async function getCartByUserId(userId: string): Promise<Cart | null> {
    const key = `cart:user:${userId}`;
    const ttl = 120; // 2 minutes, carts update frequently
    return fetchWithCache(key, ttl, () =>
        prisma.cart.findUnique({
            where: { userId },
            include: { items: { include: { product: true } } }
        })
    );
}

// create or fetch cart for user
export async function getOrCreateCart(userId: string): Promise<Cart> {
    const cached = await getCartByUserId(userId);
    if (cached) return cached;

    let cart = await prisma.cart.findUnique({ where: { userId } });
    if (!cart) {
        cart = await prisma.cart.create({ data: { userId } });
    }
    return cart;
}

// clear cart (delete all items)
export async function clearCart(cartId: string): Promise<boolean> {
    try {
        await prisma.cartItem.deleteMany({ where: { cartId } });
        await invalidatePattern(`cart:user:*`);
        return true;
    } catch (error) {
        console.error("Error clearing cart:", error);
        return false;
    }
}
