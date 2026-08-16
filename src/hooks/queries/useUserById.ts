import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-tag";
import { fetchGraphQL } from "@/app/api/graphql/fetchGraphQL";

const GET_USER_BY_ID = gql`
    query GetUserById($id: ID!) {
        user(id: $id) {
            id
            email
            name
            role
            createdAt
            orders {
                id
                status
                totalAmount
                createdAt
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

export default function useUserById(id: string) {
    return useQuery({
        queryKey: ["user", id],
        queryFn: () => {
            if (!id) throw new Error("User ID is required");
            return fetchGraphQL(GET_USER_BY_ID.toString(), { id });
        },
        enabled: !!id,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: 1000,
    });
}
