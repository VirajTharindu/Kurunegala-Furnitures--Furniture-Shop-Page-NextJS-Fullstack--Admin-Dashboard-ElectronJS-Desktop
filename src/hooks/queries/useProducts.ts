import { useQuery } from "@tanstack/react-query";


export default function useProducts(page = 1, limit = 10) {
    return useQuery({
        queryKey: ["products", page, limit],

        queryFn: async () => {
            const response = await fetch(`/api/products?page=${page}&limit=${limit}`);

            if (!response.ok) { throw new Error("Failed to fetch products") }

            return response.json();

        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: 1000,

    })

}
