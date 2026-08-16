import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete User!");
      }

      return;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },

    onError: (error) => {
      console.error("Error deleting user:", error);
      throw error;  // re-throw so component can handle it

    },


  });
}
