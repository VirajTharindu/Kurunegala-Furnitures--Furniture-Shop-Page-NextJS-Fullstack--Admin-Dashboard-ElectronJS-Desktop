import { useQueryClient, useMutation } from "@tanstack/react-query";

type Product = {
    id: string;
    name: string;
    category: string;
    price: number;
    description: string;
    availability: string;
    modelUrl: string;
    tags: string;
    specs: string;
    createdAt: string;
    updatedAt: string;
};

type UpdateProductInput = {
    id: string;
    updateData: Partial<Product>;
};

export default function useUpdateProducts() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ id, updateData }: UpdateProductInput) => {
            const response = await fetch(`/api/products/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
            });

            if (!response.ok) {
                throw new Error("Failed to update product");
            }

            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },

        onError: (error) => {
            console.error("Error updating product:", error);
            throw error;  // re-throw so component can handle it
        },
    });
}

