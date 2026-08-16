import { NextResponse, NextRequest } from "next/server";
import { orderValidationSchema } from "@/lib/validations";
import { handleError } from "@/lib/utils";
import { logger } from "@/lib/logger";
import {
  getAllOrders,
  createOrder,
  getOrdersByUserId,
} from "@/lib/dao/orderDao";
import { auth } from "@/auth";

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Successfully fetched orders
 */

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { message: "Unauthorized: Please log in" },
        { status: 401 },
      );
    }

    const orders =
      session.user.role === "ADMIN"
        ? await getAllOrders()
        : await getOrdersByUserId(session.user.id);

    return NextResponse.json(
      { orders, message: "Orders fetched successfully!" },
      { status: 200 },
    );
  } catch (error) {
    logger.error("Error fetching orders", error);
    return handleError(error);
  }
}

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Order created successfully
 *       400:
 *         description: Validation error
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedBody = orderValidationSchema.parse(body);

    // Security check: Customers can only create orders for themselves
    const targetUserId =
      session.user.role === "ADMIN" ? validatedBody.userId : session.user.id;

    const order = await createOrder(
      targetUserId,
      validatedBody.totalAmount,
      validatedBody.items,
    );
    return NextResponse.json(
      { order, message: "Order created!" },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      return NextResponse.json(
        { message: "Validation error", errors: error },
        { status: 400 },
      );
    }
    logger.error("Error creating order", error);
    return handleError(error);
  }
}

