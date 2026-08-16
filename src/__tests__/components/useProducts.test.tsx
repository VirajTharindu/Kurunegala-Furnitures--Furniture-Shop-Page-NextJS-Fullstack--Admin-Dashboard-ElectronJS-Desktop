import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import useProducts from '@/hooks/queries/useProducts';

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                gcTime: 0,
            },
        },
    });
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useProducts', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('fetches and returns products', async () => {
        const mockData = {
            products: [{ id: 'prod-1', name: 'Sofa' }],
            total: 1
        };
        jest.spyOn(global, 'fetch').mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        } as Response);

        const { result } = renderHook(() => useProducts(1, 10), { wrapper: createWrapper() });
        await waitFor(() => expect(result.current.isSuccess).toBe(true));
        expect(result.current.data.products).toHaveLength(1);
        expect(result.current.data.products[0].name).toBe('Sofa');
    });

    it('sets isError on network failure', async () => {
        jest.spyOn(global, 'fetch').mockRejectedValue(new Error('Network error'));

        const { result } = renderHook(() => useProducts(1, 10), { wrapper: createWrapper() });
        await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 4000 });
    });
});