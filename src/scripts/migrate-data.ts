/**
 * Migration Script: data.json → MSSQL via Prisma DAO
 *
 * Reads the existing data.json file from the project root and inserts
 * all product records into the MSSQL database using the Prisma client
 * (via baseDao). Handles the data transformations needed to match the
 * Prisma schema (tags → JSON string, specs → JSON string, price → Decimal).
 *
 * Usage:  npm run migrate
 *         (or)  npx tsx src/scripts/migrate-data.ts
 */

import "dotenv/config";
import { readFileSync } from "fs";
import { resolve } from "path";
import { prisma } from "@/lib/prisma";

// ── Types ─────────────────────────────────────────────────────────
interface DataJsonProduct {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    availability: string;
    modelUrl: string;
    tags: string[];
    specs: {
        width: number;
        height: number;
        depth: number;
        weight: number;
        material: string;
    };
}

// ── Main ──────────────────────────────────────────────────────────
async function migrate() {
    console.log("─── Migration Start ───────────────────────────────");

    // 1. Read data.json
    const dataPath = resolve(process.cwd(), "data.json");
    console.log(`Reading data from: ${dataPath}`);

    let rawProducts: DataJsonProduct[];
    try {
        const fileContent = readFileSync(dataPath, "utf-8");
        rawProducts = JSON.parse(fileContent);
        console.log(`Loaded ${rawProducts.length} product(s) from data.json`);
    } catch (err) {
        console.error("Failed to read data.json:", err);
        process.exit(1);
    }

    // 2. Check current DB state
    const existingCount = await prisma.product.count();
    console.log(`Current products in DB: ${existingCount}`);

    if (existingCount > 0) {
        console.log("Database already has products. Skipping duplicates...");
    }

    // 3. Insert each product
    let inserted = 0;
    let skipped = 0;

    for (const raw of rawProducts) {
        // Check if a product with the same name already exists
        const existing = await prisma.product.findFirst({
            where: { name: raw.name },
        });

        if (existing) {
            console.log(`Skipped (already exists): "${raw.name}"`);
            skipped++;
            continue;
        }

        // Transform data.json format → Prisma schema format
        const productData = {
            name: raw.name,
            category: raw.category,
            price: raw.price,                          // Prisma auto-converts number → Decimal
            description: raw.description,
            availability: raw.availability,
            modelUrl: raw.modelUrl,
            tags: JSON.stringify(raw.tags),             // String[] → JSON string
            specs: JSON.stringify(raw.specs),            // Object   → JSON string
        };

        try {
            const created = await prisma.product.create({ data: productData });
            console.log(`Inserted: "${created.name}" (id: ${created.id})`);
            inserted++;
        } catch (err) {
            console.error(`Failed to insert "${raw.name}":`, err);
        }
    }

    // 4. Summary
    console.log("\n─── Migration Summary ─────────────────────────────");
    console.log(`  Total in data.json : ${rawProducts.length}`);
    console.log(`  Inserted           : ${inserted}`);
    console.log(`  Skipped (duplicate): ${skipped}`);
    console.log(`  DB total now       : ${await prisma.product.count()}`);
    console.log("───────────────────────────────────────────────────\n");

    // 5. Cleanup
    await prisma.$disconnect();
    console.log("🔌 Prisma connection closed. Migration complete.");
}

// ── Run ───────────────────────────────────────────────────────────
migrate().catch(async (err) => {
    console.error("Migration failed:", err);
    await prisma.$disconnect();
    process.exit(1);
});
