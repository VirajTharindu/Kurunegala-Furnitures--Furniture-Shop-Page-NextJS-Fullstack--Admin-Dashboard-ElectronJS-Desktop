import { NextResponse, NextRequest } from "next/server";
import { userUpdateValidationSchema } from "@/lib/validations";
import { mapToFrontendUser, handleError } from "@/lib/utils";
import { logger } from "@/lib/logger";
import { getUserById, updateUser, deleteUser } from "@/lib/dao/userDao";
import { auth } from "@/auth";

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched user
 *       404:
 *         description: User not found
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const isOwner = session.user.id === id;
        const isAdmin = session.user.role === "ADMIN";

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ message: "Forbidden: Access denied" }, { status: 403 });
        }

        const user = await getUserById(id);
        if (!user) {
            return NextResponse.json({ message: "User not found!" }, { status: 404 });
        }
        return NextResponse.json({ user: mapToFrontendUser(user), message: "User fetched!" }, { status: 200 });
    }
    catch (error) {
        logger.error("Error fetching user", error);
        return handleError(error);
    }
}

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [Users]
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
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const isOwner = session.user.id === id;
        const isAdmin = session.user.role === "ADMIN";

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ message: "Forbidden: Access denied" }, { status: 403 });
        }

        const body = await request.json();
        const validatedBody = userUpdateValidationSchema.parse(body);

        // Security: Non-admins cannot promote themselves to ADMIN
        if (validatedBody.role === "ADMIN" && !isAdmin) {
            return NextResponse.json({ message: "Forbidden: Cannot change role to ADMIN" }, { status: 403 });
        }

        const updatedUser = await updateUser(id, validatedBody);

        if (!updatedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "User updated successfully!", user: mapToFrontendUser(updatedUser) }, { status: 200 });
    }
    catch (error) {
        if (error instanceof Error && "issues" in error) {
            return NextResponse.json({ message: "Validation error", errors: error }, { status: 400 });
        }
        logger.error("Error updating user", error);
        return handleError(error);
    }
}

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth();
        if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const isOwner = session.user.id === id;
        const isAdmin = session.user.role === "ADMIN";

        if (!isOwner && !isAdmin) {
            return NextResponse.json({ message: "Forbidden: Access denied" }, { status: 403 });
        }

        const deletedUser = await deleteUser(id);
        if (!deletedUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "User deleted successfully!" }, { status: 200 });
    }
    catch (error) {
        logger.error("Error deleting user", error);
        return handleError(error);
    }
}
