import { useProductSizes } from "../customs/product/useProductSizes";
import { Badge } from "@/components/ui/badge";

function ProductSizes({ productId }) {
  const { productSizes, isPending } = useProductSizes(productId);

  return isPending ? (
    <p>Loading...</p>
  ) : (
    <div className="flex flex-wrap gap-1">
      {productSizes?.map((sizeInfo) => (
        <Badge
          key={sizeInfo.id}
          variant="outline"
          className="text-xs bg-white border-gray-300 hover:bg-gray-50"
        >
          {sizeInfo.sizes.sizeValue}: {sizeInfo.itemCount}
        </Badge>
      ))}
    </div>
  );
}

export default ProductSizes;
