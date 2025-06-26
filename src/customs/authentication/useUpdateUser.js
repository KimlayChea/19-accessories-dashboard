import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUser as updateUserApi } from "../../services/apiAuth";

export function useUpdateUser() {
  const queryClient = useQueryClient();

  const {
    mutate: updateUser,

    isPending: isUpdating,
  } = useMutation({
    mutationFn: updateUserApi,
    onSuccess: ({ user }) => {
      // this one is no need to refetch the data
      queryClient.setQueryData(["user"], user);
    },
  });

  return { updateUser, isUpdating };
}
