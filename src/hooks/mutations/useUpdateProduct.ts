import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { productUpdateValidationSchema } from "@/lib/validations";

// productUpdateValidationSchema already has `id` required + all other fields optional
type UpdateProductInput = z.infer<typeof productUpdateValidationSchema>;

export default function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...productData }: UpdateProductInput) => {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error("Failed to update Product!");
      }

      return response.json();
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },

    onError: (error) => {
      console.error("Error updating product:", error);
      throw error;
    },
  });
}
