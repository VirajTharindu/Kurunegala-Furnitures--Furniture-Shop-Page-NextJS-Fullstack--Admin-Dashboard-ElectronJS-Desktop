import { NextResponse, NextRequest } from "next/server";
import { productValidationSchema } from "@/lib/validations";
import { mapToFrontendProduct, mapToDatabaseProduct, handleError } from "@/lib/utils";
import { logger } from "@/lib/logger";
import { getAllProducts, createProduct } from "@/lib/dao/productDao";
import { auth } from "@/auth";

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products with pagination
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Successfully fetched products
 */
export async function GET(request: NextRequest) {
    try {

        const { searchParams } = new URL(request.url);

        const page = Number(searchParams.get("page") || 1);
        const limit = Number(searchParams.get("limit") || 10);

        const skip = (page - 1) * limit;

        // get paginated data
        const products = await getAllProducts(skip, limit);

        // get total count of products
        const totalProducts = products.length;

        return NextResponse.json({
            products: products.map(mapToFrontendProduct),
            total: totalProducts,
            page,
            totalPages: Math.ceil(totalProducts / limit),
            message: "Products fetched successfully!"
        }, { status: 200 });

    }
    catch (error) {
        logger.error("Error fetching products", error);
        return handleError(error);
    }
}

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 */
export async function POST(request: NextRequest) {
    try {
        const session = await auth();
        if (session?.user?.role !== "ADMIN") {
            return NextResponse.json({ message: "Unauthorized: Only admins can create products" }, { status: 401 });
        }

        // get json body from the request
        const body = await request.json();

        // validate the body
        const parsed = productValidationSchema.safeParse(body);

        if (!parsed.success) {
            return NextResponse.json({ message: "Validation error", errors: parsed.error.issues }, { status: 400 });
        }

        //transform to db format
        const productData = mapToDatabaseProduct(parsed.data);

        //create product in db
        const product = await createProduct(productData);

        //transform response data to frontend format
        return NextResponse.json({ product: mapToFrontendProduct(product), message: "Product created!" }, { status: 201 });
    }
    catch (error) {

        //Zod validation error
        if (error instanceof Error && "issues" in error) {
            return NextResponse.json({ message: "Validation error", errors: error },
                { status: 400 }
            )
        }

        //DB error
        logger.error("Error creating product", error);
        return handleError(error);
    }
}

