import {
    mapToFrontendProduct,
    mapToDatabaseProduct,
    mapToFrontendUser,
    mapToFrontendCart,
    mapToFrontendOrder,
} from '@/lib/utils';

import { expect, describe, it, test } from '@jest/globals';

const mockDbProduct = {
    id: 'abc-123',
    name: 'Sofa',
    category: 'Sofas',
    price: { toNumber: () => 250 } as any,
    description: 'Nice sofa',
    availability: 'In Stock',
    modelUrl: 'https://example.com/sofa.glb',
    tags: '["modern","wood"]',
    specs: '{"material":"oak","weight":"30kg"}',
    createdAt: new Date(),
    updatedAt: new Date(),
}

describe('mapToFrontendProduct', () => {
    it('parses tags from JSON to string array', () => {
        const product = mapToFrontendProduct(mockDbProduct);
        expect(Array.isArray(product.tags)).toBe(true);
        expect(product.tags).toContain('modern');
        expect(product.tags).toContain('wood');
    });

    it('parses specs from JSON string to object', () => {
        const result = mapToFrontendProduct(mockDbProduct);
        expect(typeof result.specs).toBe('object');
        expect(result.specs.material).toBe('oak');
    });
    it('converts price to number', () => {
        const result = mapToFrontendProduct(mockDbProduct);
        expect(typeof result.price).toBe('number');
    });
});
describe('mapToDatabaseProduct', () => {
    it('serializes tags array to JSON string', () => {
        const frontend = { ...mockDbProduct, tags: ['modern', 'wood'], specs: { material: 'oak' }, price: 250 };
        const result = mapToDatabaseProduct(frontend);
        expect(typeof result.tags).toBe('string');
        expect(JSON.parse(result.tags)).toContain('modern');
    });
});
describe('mapToFrontendUser', () => {
    it('omits passwordHash', () => {
        const dbUser = { id: '1', email: 'a@b.com', passwordHash: 'secret', role: 'CUSTOMER', name: 'Alice', createdAt: new Date(), updatedAt: new Date() };
        const result = mapToFrontendUser(dbUser);
        expect(result).not.toHaveProperty('passwordHash');
    });
    it('returns null for null input', () => {
        expect(mapToFrontendUser(null)).toBeNull();
    });
});

