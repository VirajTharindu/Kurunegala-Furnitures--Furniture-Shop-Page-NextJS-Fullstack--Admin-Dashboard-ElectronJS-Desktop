import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { NextRequest } from "next/server";
import { resolvers } from "@/app/api/graphql/resolvers";

const typeDefs = `
# ─────────────────────────────────────────────────────────────────────
# Kurunegala Furnitures — Optimized GraphQL Schema
# ─────────────────────────────────────────────────────────────────────

# ── Custom Scalars ──────────────────────────────────────────────────
scalar DateTime

# ── Enums (Data Integrity Guards) ───────────────────────────────────
enum OrderStatus {
    PENDING
    PROCESSING
    SHIPPED
    DELIVERED
    CANCELLED
}

enum Availability {
    IN_STOCK
    OUT_OF_STOCK
    PREORDER
    DISCONTINUED
}

enum Role {
  USER
  ADMIN
}

# ── Product ─────────────────────────────────────────────────────────
type ProductSpecs {
    width: Int
    height: Int
    depth: Int
    weight: Int
    material: String
}

type Product {
    id: ID!
    name: String!
    category: String!
    price: Float!
    description: String!
    availability: Availability!
    modelUrl: String!
    tags: [String!]!
    specs: ProductSpecs
    createdAt: DateTime!
    updatedAt: DateTime!
}

# ── User ────────────────────────────────────────────────────────────
type User {
    id: ID!
    email: String!
    name: String
    role: Role!
    cart: Cart
    orders(limit: Int, offset: Int): [Order!]!
    createdAt: DateTime!
    updatedAt: DateTime!
}

# ── Order ───────────────────────────────────────────────────────────
type Order {
    id: ID!
    userId: ID!
    user: User!
    totalAmount: Float!
    status: OrderStatus!
    items: [OrderItem!]!
    createdAt: DateTime!
    updatedAt: DateTime!
}

# ── OrderItem ───────────────────────────────────────────────────────
type OrderItem {
    id: ID!
    orderId: ID!
    product: Product!
    quantity: Int!
    unitPrice: Float!
    createdAt: DateTime!
    updatedAt: DateTime!
}

# ── Cart ────────────────────────────────────────────────────────────
type Cart {
    id: ID!
    items: [CartItem!]!
    totalPrice: Float!
}

type CartItem {
    id: ID!
    product: Product!
    quantity: Int!
}

# ── Queries (The Read Engine) ───────────────────────────────────────
type Query {
    product(id: ID!): Product
    orders(limit: Int = 20, offset: Int = 0): [Order!]!
    order(id: ID!): Order
    me: User
    user(id: ID!): User
}
`;

const server = new ApolloServer({
    typeDefs,
    resolvers
});

const handler = startServerAndCreateNextHandler<NextRequest>(server);

export async function GET(req: NextRequest, ctx: any) {
    return handler(req, ctx);
}

export async function POST(req: NextRequest, ctx: any) {
    return handler(req, ctx);
}
