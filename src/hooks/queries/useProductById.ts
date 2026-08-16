import { useQuery } from "@tanstack/react-query";
import { gql } from "graphql-tag";

const GET_PRODUCT_BY_ID = gql`
    query GetProductById($id: ID!){
        product(id: $id){
            id
            name
            price
            description
            category
            tags
            specs {
                width
                height
                depth
                weight
                material
            }
            modelUrl
            availability
        }}
    `;

async function fetchGQL(query: string, variables: Record<string, unknown>) {
    const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: query.toString(), variables })

    });

    const { data, errors } = await res.json();
    if (errors) throw new Error(errors[0].message);

    return data;

}

export default function useProductById(id: string) {
    return useQuery({
        queryKey: ["product", id],
        queryFn: () => fetchGQL(GET_PRODUCT_BY_ID.toString(), { id }),

        // async () => {
        //     if (!id) throw new Error("Product ID is required");
        //     const response = await fetch(`/api/products/${id}`);
        //     if (!response.ok) { throw new Error("Failed to fetch product") }
        //     return response.json();
        // }

        enabled: !!id, // Only run the query if id is provided
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        retry: 2,
        retryDelay: 1000,
    });
}
