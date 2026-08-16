import {
  productValidationSchema,
  userValidationSchema,
  cartItemValidationSchema,
  orderValidationSchema,
} from '@/lib/validations';

describe('productValidationSchema', () => {
  const valid = {
    name: 'Chair',
    category: 'Chairs',
    price: 100,
    description: 'A chair',
    availability: 'In Stock',
    modelUrl: 'https://example.com/chair.glb',
    tags: ['wood'],
    specs: { weight: '5kg' },
  };

  it('passes with valid data', () => {
    expect(() => productValidationSchema.parse(valid)).not.toThrow();
  });

  it('fails when name is empty', () => {
    expect(() => productValidationSchema.parse({ ...valid, name: '' })).toThrow();
  });

  it('fails when price is negative', () => {
    expect(() => productValidationSchema.parse({ ...valid, price: -1 })).toThrow();
  });

  it('fails when modelUrl is not a URL', () => {
    expect(() => productValidationSchema.parse({ ...valid, modelUrl: 'not-a-url' })).toThrow();
  });
});

describe('userValidationSchema', () => {
  it('fails with invalid email', () => {
    expect(() => userValidationSchema.parse({ email: 'bad', passwordHash: 'pass123' })).toThrow();
  });

  it('fails when password is too short', () => {
    expect(() => userValidationSchema.parse({ email: 'a@b.com', passwordHash: '123' })).toThrow();
  });
});

describe('cartItemValidationSchema', () => {
  it('fails when quantity is 0', () => {
    expect(() => cartItemValidationSchema.parse({
      cartId: '00000000-0000-0000-0000-000000000001',
      productId: '00000000-0000-0000-0000-000000000002',
      quantity: 0
    })).toThrow();
  });
});
