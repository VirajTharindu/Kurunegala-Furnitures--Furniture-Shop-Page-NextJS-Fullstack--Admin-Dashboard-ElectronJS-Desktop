"use server";

import { revalidatePath } from "next/cache";
import { getOrCreateCart, clearCart } from "@/lib/dao/cartDao";
import { addCartItem, updateCartItemQuantity, removeCartItem } from "@/lib/dao/cartItemDao";
import { logger } from "@/lib/logger";
import {

    mapToFrontendCart,
    mapToDatabaseCart,
    mapToFrontendCartItem,
} from "../utils";
import {
    cartItemValidationSchema,
    cartItemUpdateValidationSchema,
    cartValidationSchema,
} from "../validations";

import { ZodError } from "zod";

/**
 * Initializes or fetches an existing cart for a user.
 */
export async function initializeCartAction(userID: string) {
    try {
        if (!userID) {
            return { success: false, status: 400, message: "User ID is required" };
        }

        const validatedBody = cartValidationSchema.parse({ userId: userID });
        const cart = await getOrCreateCart(validatedBody.userId!);

        revalidatePath("/cart");

        return {
            success: true,
            message: "Cart is ready",
            cart: mapToFrontendCart(cart),
        };
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                success: false,
                message: "Validation error",
                errors: error.flatten(),
            };
        }

        logger.error("Error initializing cart:", error);
        // We do not use handleError here because Server Actions do not return HTTP Responses (NextResponse)
        // They return plain JavaScript objects directly to the client component.
        return {
            success: false,
            message: "Internal server error"
        };
    }
}

/**
 * Adds a product to the cart.
 */
export async function addToCartAction(
    cartId: string,
    productId: string,
    quantity: number
) {
    try {
        if (!cartId || !productId || quantity == null) {
            return {
                success: false,
                message: "Cart ID, Product ID and Quantity are required",
            };
        }

        const validatedItem = cartItemValidationSchema.parse({
            cartId,
            productId,
            quantity,
        });

        // If Prisma expects Int, convert safely
        const addedItem = await addCartItem(
            validatedItem.cartId,
            validatedItem.productId,
            Number(validatedItem.quantity)
        );

        revalidatePath("/cart");

        return {
            success: true,
            message: "Item added to cart",
            item: mapToFrontendCartItem(addedItem),
        };
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                success: false,
                message: "Validation error",
                errors: error.flatten(),
            };
        }

        logger.error("Error adding cart item:", error);
        return {
            success: false,
            message: "Internal server error"
        };
    }
}

/**
 * Updates the quantity of a cart item.
 */
export async function updateCartQuantityAction(
    id: string,
    quantity: number
) {
    try {
        if (!id || quantity == null) {
            return {
                success: false,
                message: "Item ID and quantity are required",
            };
        }

        const validatedItem = cartItemUpdateValidationSchema.parse({
            id,
            quantity,
        });

        const updatedItem = await updateCartItemQuantity(
            validatedItem.id,
            Number(validatedItem.quantity)
        );

        revalidatePath("/cart");

        return {
            success: true,
            message: "Cart quantity updated",
            item: mapToFrontendCartItem(updatedItem),
        };
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                success: false,
                message: "Validation error",
                errors: error.flatten(),
            };
        }

        logger.error("Error updating cart item:", error);
        return {
            success: false,
            message: "Internal server error"
        };
    }
}

/**
 * Removes a specific item from the cart.
 */
export async function removeFromCartAction(id: string) {
    try {
        if (!id) {
            return {
                success: false,
                message: "Item ID is required",
            };
        }

        await removeCartItem(id);

        revalidatePath('/cart');

        return {
            success: true,
            message: "Item removed successfully!",
        };
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                success: false,
                message: "Validation error",
                errors: error.flatten(),
            };
        }

        logger.error("Error removing cart item:", error);
        return {
            success: false,
            message: "Internal server error"
        };
    }
}

/**
 * Clears all items from the cart.
 */
export async function clearCartAction(userId: string) {
    try {
        if (!userId) {
            return {
                success: false,
                message: "Cart ID is required",
            };
        }

        const cleared = await clearCart(userId);

        revalidatePath('/cart');

        return {
            success: cleared,
            cleared,
            message: "Cart cleared successfully!"
        };
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                success: false,
                message: "Validation error",
                errors: error.flatten(),
            };
        }

        logger.error("Error clearing cart:", error);
        return {
            success: false,
            message: "Internal server error"
        };
    }
}

