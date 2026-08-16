import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-tag";
import { fetchGraphQL } from "@/app/api/graphql/fetchGraphQL";

const GET_ORDERS = gql`
    query GetOrders($limit: Int, $offset: Int) {
        orders(limit: $limit, offset: $offset) {
            id
            status
            totalAmount
            createdAt
            user {
                name
                email
            }
        }
    }
`;

// async function fetchGQL(query: string, variables: Record<string, unknown> = {}) {
//     const res = await fetch("/api/graphql", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ query: query.toString(), variables })
//     });

//     const { data, errors } = await res.json();
//     if (errors) throw new Error(errors[0].message);

//     return data;
// }

export default function useOrders(limit = 20, offset = 0) {
    return useQuery({
        queryKey: ["orders", limit, offset],
        queryFn: () => fetchGraphQL(GET_ORDERS.toString(), { limit, offset }),
        staleTime: 2 * 60 * 1000,
        refetchOnWindowFocus: true, // Important for admins to see new orders
        retry: 2,
        retryDelay: 1000,
    });
}
