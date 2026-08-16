import { prisma } from "@/lib/prisma";
import type { CartItem } from "@/generated/prisma/client";
import { invalidatePattern } from "@/lib/redis";

// add item to cart
export async function addCartItem(cartId: string, productId: string, quantity: number): Promise<CartItem> {
    // Look up the cart to get the userId for cache invalidation
    const cart = await prisma.cart.findUnique({ where: { id: cartId } });

    // Check if item already exists in cart
    const existingItem = await prisma.cartItem.findFirst({
        where: { cartId, productId }
    });

    if (existingItem) {
        const updated = await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: existingItem.quantity + quantity }
        });
        if (cart) await invalidatePattern(`cart:user:${cart.userId}`);
        return updated;
    }

    const created = await prisma.cartItem.create({
        data: { cartId, productId, quantity }
    });
    if (cart) await invalidatePattern(`cart:user:${cart.userId}`);
    return created;
}

// update cart item quantity
export async function updateCartItemQuantity(id: string, quantity: number): Promise<CartItem> {
    const updated = await prisma.cartItem.update({
        where: { id },
        data: { quantity },
        include: { cart: true }
    });
    await invalidatePattern(`cart:user:${(updated as any).cart.userId}`);
    return updated;
}

// remove item from cart
export async function removeCartItem(id: string): Promise<boolean> {
    try {
        const item = await prisma.cartItem.findUnique({
            where: { id },
            include: { cart: true }
        });
        if (item) {
            await prisma.cartItem.delete({ where: { id } });
            await invalidatePattern(`cart:user:${item.cart.userId}`);
        }
        return true;
    } catch (error) {
        console.error("Error deleting cart item:", error);
        return false;
    }
}
