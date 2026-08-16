"use server";

import { revalidatePath } from "next/cache";
import { updateUser } from "@/lib/dao/userDao";
import { logger } from "@/lib/logger";
import { mapToFrontendUser } from "@/lib/utils";
import { userProfileUpdateSchema } from "@/lib/validations";
import { ZodError } from "zod";

/**
 * Updates a user's basic profile details securely.
 * Note: This intentionally limits updates to non-sensitive fields (like `name`).
 * We DO NOT expose updating `role` or `passwordHash` through this simple profile action!
 */
export async function updateUserProfileAction(id: string, name?: string) {
    try {
        if (!id) {
            return {
                success: false,
                message: "User ID is required",
            };
        }

        // Validate the incoming ID and Name through Zod
        const validatedBody = userProfileUpdateSchema.parse({ id, name });

        // Update the database (mapping undefined safely to null if required by Prisma)
        const updatedUser = await updateUser(validatedBody.id, {
            name: validatedBody.name ?? null
        });

        // Instantly tell Next.js to clear its cache for the profile page
        // so the new name appears immediately on the screen without a full reload
        revalidatePath("/profile");

        return {
            success: true,
            message: "Profile updated successfully",
            user: mapToFrontendUser(updatedUser)
        };
    } catch (error) {
        if (error instanceof ZodError) {
            return {
                success: false,
                message: "Validation error",
                errors: error.flatten()
            };
        }

        logger.error("Error updating user profile:", error);

        // We do not use handleError here because Server Actions do not return HTTP Responses (NextResponse)
        // They return plain JavaScript objects directly to the client component.
        return {
            success: false,
            message: "Internal server error"
        };
    }
}

