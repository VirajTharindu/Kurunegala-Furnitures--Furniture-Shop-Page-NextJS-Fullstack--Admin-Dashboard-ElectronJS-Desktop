import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete Product!");
      }

      return;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },

    onError: (error) => {
      console.error("Error deleting product:", error);
      throw error;  // re-throw so component can handle it
    },
  });
}
