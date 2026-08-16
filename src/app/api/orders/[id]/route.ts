import { NextResponse, NextRequest } from "next/server";
import { orderUpdateStatusSchema } from "@/lib/validations";
import { handleError } from "@/lib/utils";
import { logger } from "@/lib/logger";
import { getOrderById, updateOrderStatus, deleteOrder } from "@/lib/dao/orderDao";
import { auth } from "@/auth";

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched order
 *       404:
 *         description: Order not found
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const order = await getOrderById(id);
        if (!order) {
            return NextResponse.json({ message: "Order not found!" }, { status: 404 });
        }

        const isOwner = session.user.id === order.userId;
        const isAdmin = session.user.role === "ADMIN";

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ message: "Forbidden: Access denied" }, { status: 403 });
        }

        return NextResponse.json({ order, message: "Order fetched!" }, { status: 200 });
    }
    catch (error) {
        logger.error("Error fetching order", error);
        return handleError(error);
    }
}

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update an order status by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Order updated successfully
 *       404:
 *         description: Order not found
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 401 });
        }

        const body = await request.json();
        const validatedBody = orderUpdateStatusSchema.parse(body);
        const updatedOrder = await updateOrderStatus(id, validatedBody.status);

        if (!updatedOrder) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Order updated successfully!", order: updatedOrder }, { status: 200 });
    }
    catch (error) {
        if (error instanceof Error && "issues" in error) {
            return NextResponse.json({ message: "Validation error", errors: error }, { status: 400 });
        }
        logger.error("Error updating order status", error);
        return handleError(error);
    }
}

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 401 });
        }

        const deletedOrder = await deleteOrder(id);
        if (!deletedOrder) {
            return NextResponse.json({ message: "Order not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Order deleted successfully!" }, { status: 200 });
    }
    catch (error) {
        logger.error("Error deleting order", error);
        return handleError(error);
    }
}
