import { NextResponse, NextRequest } from "next/server";
import { userValidationSchema } from "@/lib/validations";
import { mapToFrontendUser, handleError } from "@/lib/utils";
import { logger } from "@/lib/logger";
import { getAllUsers, createUser } from "@/lib/dao/userDao";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Successfully fetched users
 */
export async function GET(request: NextRequest) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 401 });
        }

        const users = await getAllUsers();
        return NextResponse.json({ users: users.map(mapToFrontendUser), message: "All Users fetched successfully!" }, { status: 200 });
    }
    catch (error) {
        logger.error("Error fetching users", error);
        return handleError(error);
    }
}

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth();

        // Only Admins can create other Admins or certain roles.
        // For public registration, you might want to allow this without a session,
        // but here we restrict it as an example of server-side session control.

        const body = await request.json();
        const validatedBody = userValidationSchema.parse(body);

        if (validatedBody.role === "ADMIN" && session?.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Forbidden: Only admins can create admin users" }, { status: 403 });
        }

        const passwordHash = await bcrypt.hash(validatedBody.password, 10);

        const user = await createUser({
            email: validatedBody.email,
            passwordHash,
            name: validatedBody.name ?? null,
            role: validatedBody.role ?? "CUSTOMER"
        });
        return NextResponse.json({ user: mapToFrontendUser(user), message: "User created!" }, { status: 201 });
    }
    catch (error) {
        if (error instanceof Error && "issues" in error) {
            return NextResponse.json({ message: "Validation error", errors: error }, { status: 400 });
        }
        logger.error("Error creating user", error);
        return handleError(error);
    }
}

