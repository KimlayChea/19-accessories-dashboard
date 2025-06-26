import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateUserAvatar } from "../../services/apiAuth";

export function useUpdateAvatar() {
  const queryClient = useQueryClient();
  //   const { toast } = useToast();

  const { mutate: updateAvatar, isPending: isUpdating } = useMutation({
    mutationFn: updateUserAvatar,
    onSuccess: ({ user }) => {
      // this one is no need to refetch the data
      queryClient.setQueryData(["user"], user);

      //   queryClient.invalidateQueries(["user"]);

      //   toast({
      //     title: "Update successful",
      //     description: "User profile successfully updated",
      //   });
    },
    onError: (error) => {
      //   toast({
      //     variant: "destructive",
      //     title: "Update failed",
      //     description: error.message || "Something went wrong, please try again.",
      //   });
    },
  });

  return { updateAvatar, isUpdating };
}
