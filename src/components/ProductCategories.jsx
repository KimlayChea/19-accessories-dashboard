import { useProductCategories } from "../customs/product/useProductCategories";
import { Badge } from "@/components/ui/badge";

function ProductCategories({ productId }) {
  const { productCategories, isPending } = useProductCategories(productId);

  return isPending ? (
    <p>Loading...</p>
  ) : (
    <div className="flex flex-wrap gap-1 mb-4">
      {productCategories?.map((category) => (
        <Badge
          key={category.id}
          className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 hover:from-purple-200 hover:to-pink-200 border-0"
        >
          {category.categories.category}
        </Badge>
      ))}
    </div>
  );
}

export default ProductCategories;
