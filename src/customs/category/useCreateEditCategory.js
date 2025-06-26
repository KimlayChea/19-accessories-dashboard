import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEditCategory as createEditCategoryApi } from "../../services/apiCategory";

export function useCreateEditCategory() {
  const queryCilent = useQueryClient();

  const { mutate: createEditCategory, isPending: isCreatingEditting } =
    useMutation({
      mutationFn: createEditCategoryApi,
      onSuccess: () => {
        queryCilent.invalidateQueries(["categories"]);
      },
      onError: (error) => {
        console.error(error);
      },
    });

  return { createEditCategory, isCreatingEditting };
}
