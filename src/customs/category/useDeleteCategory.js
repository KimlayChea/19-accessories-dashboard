import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCategory as deleteCategoryApi } from "../../services/apiCategory";

export function useDeleteCategory() {
  const queryCilent = useQueryClient();

  const { mutate: deleteCategory, isPending: isDeleting } = useMutation({
    mutationFn: deleteCategoryApi,
    onSuccess: () => {
      queryCilent.invalidateQueries(["categories"]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return { deleteCategory, isDeleting };
}
