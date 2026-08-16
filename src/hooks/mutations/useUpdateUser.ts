import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { userUpdateValidationSchema } from "@/lib/validations";

// userUpdateValidationSchema already has `id` required + all other user fields optional
type UpdateUserInput = z.infer<typeof userUpdateValidationSchema>;

export default function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...userData }: UpdateUserInput) => {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to update User!");
      }

      return response.json();
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.id] });
    },

    onError: (error) => {
      console.error("Error updating user:", error);
      throw error;
    },
  });
}
