import { useQuery } from "@tanstack/react-query";
import { getSizes } from "../../services/apiProduct";

export function useSizes() {
  const { isPending, data: sizes } = useQuery({
    queryKey: ["sizes"],
    queryFn: getSizes,
  });

  return {
    sizes,
    isPending,
  };
}
