import { getProductById } from "@/lib/dao/productDao";
import { getAllOrders, getOrderById, getOrdersByUserId } from "@/lib/dao/orderDao";
import { getUserById } from "@/lib/dao/userDao";
import { getCartByUserId } from "@/lib/dao/cartDao";
import {
    mapToFrontendProduct,
    mapToFrontendOrder,
    mapToFrontendUser,
    mapToFrontendCart
} from "@/lib/utils";
import { auth } from "@/auth";

export const resolvers = {
    Query: {
        product: async (_: unknown, { id }: { id: string }) => {
            const product = await getProductById(id);
            return product ? mapToFrontendProduct(product) : null;
        },

        orders: async (_: unknown, { limit, offset }: { limit: number, offset: number }) => {
            const session = await auth();
            if (!session) throw new Error("Unauthorized");

            const limitVal = limit || 20;
            const offsetVal = offset || 0;

            const orders = session.user.role === "ADMIN" 
                ? await getAllOrders()
                : await getOrdersByUserId(session.user.id);
            
            return orders.slice(offsetVal, offsetVal + limitVal).map(mapToFrontendOrder);
        },

        order: async (_: unknown, { id }: { id: string }) => {
            const session = await auth();
            if (!session) throw new Error("Unauthorized");
            
            const order = await getOrderById(id);
            if (!order) return null;

            if (session.user.role !== "ADMIN" && session.user.id !== order.userId) {
                throw new Error("Forbidden");
            }

            return mapToFrontendOrder(order);
        },

        me: async () => {
            const session = await auth();
            if (!session) return null;
            const user = await getUserById(session.user.id);
            return user ? mapToFrontendUser(user) : null;
        },

        user: async (_: unknown, { id }: { id: string }) => {
            const session = await auth();
            if (!session) throw new Error("Unauthorized");

            if (session.user.role !== "ADMIN" && session.user.id !== id) {
                throw new Error("Forbidden");
            }

            const user = await getUserById(id);
            return user ? mapToFrontendUser(user) : null;
        }
    },

    User: {
        orders: async (parent: { id: string }, { limit, offset }: { limit?: number, offset?: number }) => {
            const userOrders = await getOrdersByUserId(parent.id);

            let result = userOrders;
            if (offset !== undefined || limit !== undefined) {
                const start = offset || 0;
                const end = limit !== undefined ? start + limit : undefined;
                result = userOrders.slice(start, end);
            }

            return result.map(mapToFrontendOrder);
        },

        cart: async (parent: { id: string }) => {
            const cart = await getCartByUserId(parent.id);
            return cart ? mapToFrontendCart(cart) : null;
        }
    },

    Cart: {
        totalPrice: (parent: any) => {
            if (!parent.items || parent.items.length === 0) return 0;
            return parent.items.reduce((total: number, item: any) => {
                const price = item.product?.price || 0;
                return total + (price * item.quantity);
            }, 0);
        }
    }
};
