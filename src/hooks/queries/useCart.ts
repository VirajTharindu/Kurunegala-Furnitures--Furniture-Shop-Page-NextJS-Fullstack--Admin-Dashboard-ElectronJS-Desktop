import { useQuery } from "@tanstack/react-query";

export default function useCart(userId: string) {
    return useQuery({
        queryKey: ["cart", userId],
        queryFn: async () => {
            if (!userId) throw new Error("User ID is required");
            const response = await fetch(`/api/cart?userId=${userId}`);
            if (!response.ok) { throw new Error("Failed to fetch cart") }
            return response.json();
        },
        enabled: !!userId,
        staleTime: 1 * 60 * 1000, // Carts change more often, 1 min stale time
        refetchOnWindowFocus: true, // Refetch on focus to ensure cart is up to date
        retry: 2,
        retryDelay: 1000,
    });
}
