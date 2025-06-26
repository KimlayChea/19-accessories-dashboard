import { useProductSizes } from "../customs/product/useProductSizes";

function ProductStock({ productId }) {
  const { productSizes, isPending } = useProductSizes(productId);
  const totalStock = productSizes?.reduce((acc, cur) => acc + cur.itemCount, 0);

  return (
    <span className="text-blue-600 font-medium">
      {isPending ? "Loading..." : `Stock: ${totalStock}`}
    </span>
  );
}

export default ProductStock;
