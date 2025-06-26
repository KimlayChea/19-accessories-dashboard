import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "@/pages/Products";

interface ProductDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}
import { useProductCategories } from "@/customs/product/useProductCategories";
import { useProductSizes } from "@/customs/product/useProductSizes";

export const ProductDetails = ({
  isOpen,
  onClose,
  product,
}: ProductDetailsProps) => {
  const { isPending: isPendingProductCategories, productCategories } =
    useProductCategories(product?.id);
  const { isPending: isPendingProductSizes, productSizes } = useProductSizes(
    product?.id
  );

  if (!product || (isPendingProductCategories && isPendingProductSizes))
    return null;

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </div>
            <span>{product.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Basic Information</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Price:</span>
                  <div className="flex items-center space-x-2">
                    {product.discount > 0 ? (
                      <>
                        <p className="font-semibold text-green-600 text-xl">
                          $
                          {calculateDiscountedPrice(
                            product.price,
                            product.discount
                          ).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500 line-through">
                          ${product.price.toFixed(2)}
                        </p>
                        <Badge variant="destructive" className="text-xs">
                          -{product.discount}%
                        </Badge>
                      </>
                    ) : (
                      <p className="font-semibold text-green-600 text-xl">
                        ${product.price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Total Stock:</span>
                  <p className="font-semibold text-lg">
                    {productSizes.reduce((acc, cur) => acc + cur.itemCount, 0)}{" "}
                    items
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Sold:</span>
                  <p className="font-semibold text-lg">{product.sold} items</p>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">Description:</span>
                <p className="mt-1">{product.description}</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Categories</h3>

                <div className="flex flex-wrap gap-2">
                  {productCategories?.map((category) => (
                    <Badge key={category.id} variant="secondary">
                      {category.categories.category}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Product Features</h3>
                <div className="flex flex-wrap gap-2">
                  {product.productFeatures.length === 0 ? (
                    <p className="text-secondary-foreground/80">
                      No features available
                    </p>
                  ) : (
                    product.productFeatures.map((feature) => (
                      <Badge key={feature} variant="outline">
                        {feature}
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Size & Stock Details</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {productSizes?.map((sizeInfo) => (
                  <div
                    key={sizeInfo.id}
                    className="bg-gray-50 p-3 rounded-lg text-center"
                  >
                    <div className="font-semibold text-lg">
                      {sizeInfo.sizes.sizeValue}
                    </div>
                    <div className="text-sm text-gray-600">
                      {sizeInfo.itemCount} items
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (sizeInfo.itemCount /
                              Math.max(
                                ...productSizes.map((s) => {
                                  return s.itemCount;
                                })
                              )) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Material & Care</h3>
              <p className="text-gray-700">
                {product.materialAndCare === "" ? (
                  <span className="text-secondary-foreground/80">
                    No features available
                  </span>
                ) : (
                  product.materialAndCare
                )}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-2">Product Information</h3>
              <div className="text-sm text-gray-600">
                <p>
                  Created:{" "}
                  {new Date(product.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
                <p>Product ID: {product.id}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
