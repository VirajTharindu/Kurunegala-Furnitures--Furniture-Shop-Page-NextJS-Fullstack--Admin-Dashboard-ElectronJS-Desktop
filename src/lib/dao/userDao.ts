import { prisma } from "@/lib/prisma";
import { fetchWithCache } from "@/lib/cache";
import type { User } from "@/generated/prisma/client";
import { mapToFrontendUser } from "@/lib/utils";
import { invalidatePattern } from "@/lib/redis";

// fetch all users
export async function getAllUsers() {
    const key = "users:all";
    const ttl = 300; // 5 minutes
    return fetchWithCache(key, ttl, async () => {
        const users = await prisma.user.findMany();
        return users.map(u => {
            const { passwordHash, ...safe } = u;
            return safe;
        });
    });
}

// fetch 1 user by ID
export async function getUserById(id: string) {
    const key = `user:${id}`;
    const ttl = 300;
    return fetchWithCache(key, ttl, async () => {
        const user = await prisma.user.findUnique({ where: { id } });
        if (!user) return null;
        const { passwordHash, ...safe } = user;
        return safe;
    });
}

// fetch 1 user by Email
export async function getUserByEmail(email: string) {
    const key = `user:email:${email}`;
    const ttl = 300;
    return fetchWithCache(key, ttl, async () => {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;
        const { passwordHash, ...safe } = user;
        return safe;
    });
}

// create a new user
export async function createUser(data: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const user = await prisma.user.create({ data });
    await invalidatePattern("users:all");
    return user;
}

// update an existing user
export async function updateUser(id: string, updates: Partial<Omit<User, "id" | "createdAt" | "updatedAt">>): Promise<User> {
    const user = await prisma.user.update({ where: { id }, data: updates });

    await invalidatePattern(`user:${id}`);
    await invalidatePattern("users:all");

    if (updates.email) {
        // Since the email changed, the previous email is now stale, so we invalidate the pattern to catch the old one
        await invalidatePattern(`user:email:*`);
    }

    return user;
}

// delete user
export async function deleteUser(id: string): Promise<boolean> {
    try {
        await prisma.user.delete({ where: { id } });

        await invalidatePattern(`user:${id}`);
        await invalidatePattern("users:all");
        await invalidatePattern(`user:email:*`);

        return true;
    } catch (error) {
        console.error("Error deleting user:", error);
        return false;
    }
}
