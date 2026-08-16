import { z } from "zod";

// --- Product Validations ---
export const productValidationSchema = z.object({
    name: z.string().min(1, "Name is required"),
    category: z.string().min(1, "Category is required"),
    price: z.number().positive("Price must be greater than 0"),
    description: z.string().min(1, "Description is required"),
    availability: z.string().min(1, "Availability is required"),
    modelUrl: z.url("Invalid URL"),
    tags: z.array(z.string()).min(1, "Tags are required"),
    specs: z.record(z.string(), z.any()) // matches the frontend spec object
});

export const productUpdateValidationSchema = productValidationSchema.partial().extend({
    id: z.uuid("Invalid UUID")
});

// --- User Validations ---
export const userValidationSchema = z.object({
    email: z.string().email("Invalid email address"),
    name: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.string().optional()
});

export const userUpdateValidationSchema = z.object({
    id: z.uuid("Invalid UUID"),
    email: z.string().email("Invalid email address").optional(),
    name: z.string().optional(),
    role: z.string().optional()
});

export const userProfileUpdateSchema = z.object({
    id: z.uuid("Invalid UUID"),
    name: z.string().optional(),
});

// --- Cart Validations ---
export const cartValidationSchema = z.object({
    userId: z.uuid("Invalid User ID")
});

export const cartItemValidationSchema = z.object({
    cartId: z.uuid("Invalid Cart ID"),
    productId: z.uuid("Invalid Product ID"),
    quantity: z.number().int().positive("Quantity must be greater than 0")
});

export const cartItemUpdateValidationSchema = z.object({
    id: z.uuid("Invalid Item ID"),
    quantity: z.number().int().positive("Quantity must be greater than 0")
});

// --- Order Validations ---
export const orderItemValidationSchema = z.object({
    productId: z.uuid("Invalid Product ID"),
    quantity: z.number().int().positive("Quantity must be greater than 0"),
    unitPrice: z.number().positive("Unit price must be greater than 0")
});

export const orderValidationSchema = z.object({
    userId: z.uuid("Invalid User ID"),
    totalAmount: z.number().positive("Total amount must be greater than 0"),
    status: z.string().optional(),
    items: z.array(orderItemValidationSchema).min(1, "Order must have at least one item")
});

export const orderUpdateStatusSchema = z.object({
    id: z.uuid("Invalid Order ID"),
    status: z.string().min(1, "Status is required")
});
