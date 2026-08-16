import { http, HttpResponse } from 'msw';

const mockProducts = [
    {
        id: 'prod-1',
        name: 'Sofa',
        category: 'Sofas',
        price: 250,
        description: 'A comfy sofa',
        availability: 'In Stock',
        modelUrl: 'https://example.com/sofa.glb',
        tags: ['modern'],
        specs: { material: 'fabric' },
    },
];

export const handlers = [

    // User handlers
    http.get('api/users', () => {
        return HttpResponse.json(
            [
                { id: 1, name: 'Viraj' }
            ]
        )
    }),
    http.get('/api/users/:id', ({ params }) => {
        const { id } = params
        return HttpResponse.json({ id, name: 'Viraj' })
    }),
    http.post('/api/users', ({ request }) => {
        const { name } = request.body as unknown as { name: string }
        return HttpResponse.json({ id: 2, name })
    }),
    http.put('/api/users/:id', ({ params, request }) => {
        const { id } = params
        const { name } = request.body as unknown as { name: string }
        return HttpResponse.json({ id, name })
    }),
    http.delete('/api/users/:id', ({ params }) => {
        const { id } = params
        return HttpResponse.json({ id })
    }),

    // Product handlers
    http.get('/api/products', () => HttpResponse.json({ products: mockProducts, total: 1 })),
    http.get('/api/products/:id', ({ params }) =>
        HttpResponse.json(mockProducts.find(p => p.id === params.id) ?? null, { status: 404 })
    ),
    http.post('/api/products', () => HttpResponse.json({ ...mockProducts[0], id: 'new-prod' }, { status: 201 })),
    http.delete('/api/products/:id', () => HttpResponse.json({ success: true })),


]
