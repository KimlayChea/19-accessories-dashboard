import { useMutation } from "@tanstack/react-query";
import { verifyCurrentPassword as verifyCurrentPasswordApi } from "../../services/apiAuth";

export function useVerifyCurrentPassword() {
  const { mutate: verifyCurrentPassword, isPending } = useMutation({
    mutationFn: verifyCurrentPasswordApi,
  });

  return { verifyCurrentPassword, isPending };
}
