import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { userValidationSchema } from "@/lib/validations";

// For user creation, passwordHash must be provided
type CreateUserInput = z.infer<typeof userValidationSchema>;

export default function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userData: CreateUserInput) => {
      const response = await fetch(`/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("Failed to create User!");
      }

      return response.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error) => {
      console.error("Error creating user:", error);
      throw error;
    },
  });
}
