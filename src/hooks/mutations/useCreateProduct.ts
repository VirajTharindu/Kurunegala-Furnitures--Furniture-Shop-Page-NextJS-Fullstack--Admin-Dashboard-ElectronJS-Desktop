import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { productValidationSchema } from "@/lib/validations";

// Infer the type directly from the Zod schema — single source of truth
type CreateProductInput = z.infer<typeof productValidationSchema>;

export default function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productData: CreateProductInput) => {
      const response = await fetch(`/api/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to create Product!");
      }

      return response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },

    onError: (error) => {
      console.error("Error creating product:", error);
      throw error;
    },
  });
}
