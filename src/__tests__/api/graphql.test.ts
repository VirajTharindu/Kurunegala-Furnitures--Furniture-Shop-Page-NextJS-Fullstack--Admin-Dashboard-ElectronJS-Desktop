import { createServer } from "http";
import { NextRequest } from "next/server";
import supertest from "supertest";

// Mock cache and Redis to prevent connection timeouts in tests
jest.mock("@/lib/cache", () => ({
    fetchWithCache: jest.fn((key: string, ttl: number, fetcher: () => Promise<any>) => fetcher()),
}));

jest.mock("@/lib/redis", () => ({
    __esModule: true,
    default: {
        get: jest.fn().mockResolvedValue(null),
        setex: jest.fn().mockResolvedValue("OK"),
        del: jest.fn().mockResolvedValue(1),
        on: jest.fn(),
    },
}));

// Mock database layer so integration tests are fast and isolated
jest.mock("@/lib/prisma", () => ({
    prisma: {
        product: {
            findMany: jest.fn().mockResolvedValue([]),
            findUnique: jest.fn().mockResolvedValue({
                id: "prod-1",
                name: "Aura Chair",
                category: "Chairs",
                price: 499.99,
                description: "Bespoke handcrafted chair",
                availability: "IN_STOCK",
                modelUrl: "/models/chair.glb",
                tags: "[\"modern\", \"wood\"]",
                specs: "{\"width\": 80, \"height\": 95, \"depth\": 75}",
                createdAt: new Date(),
                updatedAt: new Date(),
            }),
        },
        order: {
            findMany: jest.fn().mockResolvedValue([]),
            findUnique: jest.fn().mockResolvedValue(null),
        },
        user: {
            findUnique: jest.fn().mockResolvedValue(null),
        },
        cart: {
            findUnique: jest.fn().mockResolvedValue(null),
        },
    },
}));

// Mock auth session
jest.mock("@/auth", () => ({
    auth: jest.fn().mockResolvedValue(null),
}));

import { POST } from "@/app/api/graphql/route";

// Create a wrapper server to test the Next.js App Router handler with Supertest
const server = createServer(async (req, res) => {
    try {
        let body = "";
        for await (const chunk of req) {
            body += chunk;
        }

        const nextReq = new NextRequest(`http://localhost${req.url}`, {
            method: req.method,
            headers: req.headers as any,
            body: body ? body : undefined,
        });

        const response = await POST(nextReq, {});

        res.statusCode = response.status;
        response.headers.forEach((value, key) => {
            res.setHeader(key, value);
        });

        const responseBody = await response.text();
        res.end(responseBody);
    } catch (error) {
        console.error(error);
        res.statusCode = 500;
        res.end("Internal Server Error");
    }
});

const request = supertest(server);

describe("GraphQL API Integration (Supertest + Apollo)", () => {
    it("should return the current user (me) as null when unauthenticated", async () => {
        const query = `
            query {
                me {
                    id
                    email
                }
            }
        `;

        const response = await request
            .post("/api/graphql")
            .set("Content-Type", "application/json")
            .send({ query });

        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.me).toBeNull();
    });

    it("should fetch a product by ID via public GraphQL query", async () => {
        const query = `
            query {
                product(id: "prod-1") {
                    id
                    name
                    price
                    category
                }
            }
        `;

        const response = await request
            .post("/api/graphql")
            .set("Content-Type", "application/json")
            .send({ query });

        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined();
        expect(response.body.data.product).toBeDefined();
        expect(response.body.data.product.name).toBe("Aura Chair");
        expect(response.body.data.product.price).toBe(499.99);
    });

    it("should reject orders query with Unauthorized when not logged in", async () => {
        const query = `
            query {
                orders {
                    id
                    status
                }
            }
        `;

        const response = await request
            .post("/api/graphql")
            .set("Content-Type", "application/json")
            .send({ query });

        expect(response.status).toBe(200);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors[0].message).toContain("Unauthorized");
    });

    it("should return GraphQL syntax error for invalid queries", async () => {
        const query = `
            query {
                invalidFieldNonExistent
            }
        `;

        const response = await request
            .post("/api/graphql")
            .set("Content-Type", "application/json")
            .send({ query });

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
        expect(response.body.errors.length).toBeGreaterThan(0);
    });
});
