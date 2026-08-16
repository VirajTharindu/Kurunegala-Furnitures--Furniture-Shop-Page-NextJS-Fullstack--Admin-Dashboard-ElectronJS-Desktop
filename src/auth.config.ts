import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config — imported ONLY by middleware.
 * Must NOT import Prisma, bcrypt, or any other Node.js-only module.
 * The full auth config (with Prisma + bcrypt) lives in auth.ts.
 */
export const authConfig: NextAuthConfig = {
    session: { strategy: "jwt" },
    providers: [],   // providers are added in auth.ts, not needed here
    callbacks: {
        // JWT shape is already populated by auth.ts; we just read it here.
        authorized({ auth }) {
            return true; // route protection is handled manually in middleware
        },
    },
};
