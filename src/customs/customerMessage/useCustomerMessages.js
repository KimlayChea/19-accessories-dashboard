import { useQuery } from "@tanstack/react-query";
import { getCustomerMessages } from "../../services/apiCustomer";

export function useCustomerMessages() {
  const { isPending, data: customerMessages } = useQuery({
    queryKey: ["customerMessages"],
    queryFn: getCustomerMessages,
  });

  return {
    customerMessages,
    isPending,
  };
}
