import NextAuth, { type DefaultSession } from "next-auth";
import { type JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authConfig } from "@/auth.config";

// Extend the built-in session and user types to include our custom fields (id, role)

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
        } & DefaultSession['user'];
    }

    interface User {
        role: string;
    }

}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        role: string;
    }
}


export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,

    // Set session stategy to JWT
    session: { strategy: "jwt" },

    // 
    providers: [

        // Credentials Provider for sign in using Email & Password
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "x@gmail.com" },
                password: { label: "Password", type: "password", placeholder: "*********" }
            },

            // Authorize function to validate credentials
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                // Find user by email in the database
                const user = await prisma.user.findUnique({
                    where: { email: credentials.email as string }
                });

                // Check if user exists and has a password hash
                if (!user || !user.passwordHash) {
                    return null;
                }

                // Verify password
                const isValid = await bcrypt.compare(
                    credentials.password as string,
                    user.passwordHash as string
                )

                // If password is not valid, return null
                if (!isValid) {
                    return null;
                }

                // Return the user object
                return {
                    id: user.id,
                    email: user.email,
                    role: user.role,
                    name: user.name,

                }

            }

        })


    ],

    callbacks: {

        // JWT callback
        async jwt({ token, user }) {

            // The user object is only passed the first time after sign in
            if (user) {
                token.id = user.id as string
                token.role = user.role as string
            }
            return token
        },

        // Session callback
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string
                session.user.role = token.role as string
            }
            return session;
        }


    }
})


