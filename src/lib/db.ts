import fs from 'fs/promises';
import path from 'path';

export interface Product {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    availability: "In Stock" | "Low Stock" | "Out of Stock";
    modelUrl: string;
    tags: string[];
    specs: {
        width: number;
        height: number;
        depth: number;
        weight: number;
        material?: string;
    };
}

const DB_PATH = path.join(process.cwd(), 'data.json');

async function ensureDB() {
    try {
        await fs.access(DB_PATH);
    } catch {
        await fs.writeFile(DB_PATH, JSON.stringify([], null, 4));
    }
}

export const getProducts = async (): Promise<Product[]> => {
    await ensureDB();
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
    const products = await getProducts();
    return products.find(p => p.id === id);
};

export const addProduct = async (product: Product): Promise<Product> => {
    const products = await getProducts();
    const newProducts = [...products, product];
    await fs.writeFile(DB_PATH, JSON.stringify(newProducts, null, 4));
    return product;
};

export const updateProduct = async (id: string, updates: Partial<Product>): Promise<Product | undefined> => {
    const products = await getProducts();
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return undefined;

    const updatedProduct = { ...products[index], ...updates };
    products[index] = updatedProduct;
    await fs.writeFile(DB_PATH, JSON.stringify(products, null, 4));
    return updatedProduct;
};

export const deleteProduct = async (id: string): Promise<boolean> => {
    const products = await getProducts();
    const newProducts = products.filter(p => p.id !== id);
    if (products.length === newProducts.length) return false;
    await fs.writeFile(DB_PATH, JSON.stringify(newProducts, null, 4));
    return true;
};
