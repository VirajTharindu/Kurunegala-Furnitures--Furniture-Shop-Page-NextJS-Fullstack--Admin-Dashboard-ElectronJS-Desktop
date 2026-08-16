import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { orderUpdateStatusSchema } from "@/lib/validations";

// Only status updates are allowed via this hook (matches the orderUpdateStatusSchema)
type UpdateOrderInput = z.infer<typeof orderUpdateStatusSchema>;

export default function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: UpdateOrderInput) => {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error("Failed to update Order!");
      }

      return response.json();
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
    },

    onError: (error) => {
      console.error("Error updating order:", error);
      throw error;
    },
  });
}
