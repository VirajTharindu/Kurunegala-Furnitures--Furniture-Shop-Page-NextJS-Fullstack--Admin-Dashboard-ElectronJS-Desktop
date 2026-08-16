import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-tag";
import { fetchGraphQL } from "@/app/api/graphql/fetchGraphQL";

const GET_ORDER_BY_ID = gql`
    query GetOrderById($id: ID!) {
        order(id: $id) {
            id
            status
            totalAmount
            createdAt
            user {
                name
                email
            }
            items {
                id
                quantity
                unitPrice
                product {
                    id
                    name
                    price
                }
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

export default function useOrderById(id: string) {
    return useQuery({
        queryKey: ["order", id],
        queryFn: () => {
            if (!id) throw new Error("Order ID is required");
            return fetchGraphQL(GET_ORDER_BY_ID.toString(), { id });
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: true, // Order status might change
        retry: 2,
        retryDelay: 1000,
    });
}
