import { useQuery } from "@tanstack/react-query";

export default function useUsers() {
    return useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const response = await fetch(`/api/users`);
            if (!response.ok) { throw new Error("Failed to fetch users") }
            return response.json();
        },
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: 1000,
    });
}
