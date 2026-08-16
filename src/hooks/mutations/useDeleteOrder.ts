import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete Order!");
      }

      return;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },

    onError: (error) => {
      console.error("Error deleting order:", error);
      throw error;  // re-throw so component can handle it
    },
  });
}
