import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateStatus as updateStatusApi } from "../../services/apiCustomer";

export function useUpdateStatus() {
  const queryCilent = useQueryClient();

  const { mutate: updateStatus, isPending: isUpdating } = useMutation({
    mutationFn: updateStatusApi,
    onSuccess: () => {
      queryCilent.invalidateQueries(["customerMessages"]);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  return { updateStatus, isUpdating };
}
