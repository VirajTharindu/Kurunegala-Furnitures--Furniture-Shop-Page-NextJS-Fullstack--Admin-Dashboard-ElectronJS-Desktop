import { NextResponse, NextRequest } from "next/server";
import { productUpdateValidationSchema } from "@/lib/validations";
import { mapToFrontendProduct, mapToDatabaseProduct, handleError } from "@/lib/utils";
import { logger } from "@/lib/logger";
import { getProductById, updateProduct, deleteProduct } from "@/lib/dao/productDao";

import { auth } from "@/auth";

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully fetched product
 *       404:
 *         description: Product not found
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const product = await getProductById(id);

        if (!product) {

            return NextResponse.json({ message: "Selected product is not found!" }, { status: 404 });

        }

        return NextResponse.json({ product: mapToFrontendProduct(product), message: "The Product is fetched!" }, { status: 200 });

    }
    catch (error) {
        logger.error("Error fetching product", error);
        return handleError(error);
    }
}

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags: [Products]
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
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 401 });
        }

        // get the json body from the request
        const body = await request.json();
        const parsed = productUpdateValidationSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ message: "Validation error", errors: parsed.error.issues }, { status: 400 });
        }

        const productData = mapToDatabaseProduct(parsed.data);
        const updatedProduct = await updateProduct(id, productData);

        //check if product was updated
        if (!updatedProduct) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 })
        }

        return NextResponse.json({ message: "Product updated successfully!", product: mapToFrontendProduct(updatedProduct) }, { status: 200 });

    }
    catch (error) {

        //Zod validation error
        if (error instanceof Error && "issues" in error) {
            return NextResponse.json({ message: "Validation error", errors: error },
                { status: 400 }
            )
        }

        //DB error
        logger.error("Error updating product", error);
        return handleError(error);

    }
}

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 */
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Unauthorized: Admin access required" }, { status: 401 });
        }

        const deletedProduct = await deleteProduct(id);
        if (!deletedProduct) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Product deleted successfully!", product: deletedProduct }, { status: 200 });
    }
    catch (error) {
        logger.error("Error deleting product", error);
        return handleError(error);
    }
}




