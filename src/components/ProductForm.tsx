import { useState, useEffect, useRef, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { Product } from "@/pages/Products";
import { useProductCategories } from "@/customs/product/useProductCategories";
import { useCategories } from "@/customs/category/useCategories";
import { useProductSizes } from "@/customs/product/useProductSizes";
import { useSizes } from "@/customs/product/useSizes";
import { useEditProduct } from "@/customs/product/useEditProduct";
import { useCreateProduct } from "@/customs/product/useCreateProduct";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Product | null;
  title: string;
}

const typeOptions = ["Shirt", "Pant", "Shoes", "Accessories"];

export const ProductForm = ({
  isOpen,
  onClose,
  initialData,
  title,
}: ProductFormProps) => {
  const { productCategories } = useProductCategories(initialData?.id);
  const { productSizes } = useProductSizes(initialData?.id);
  const { categories } = useCategories();
  const { sizes } = useSizes();

  const allProductcategoriesIds = useMemo(
    () => productCategories?.map((cat) => cat.categories.id),
    [productCategories]
  );

  const { isEditting, editProduct } = useEditProduct();
  const { isCreating, createProduct } = useCreateProduct();

  const productSizesFormat = useMemo(
    () =>
      productSizes?.map((size) => ({
        id: size.size_id,
        size: size.sizes.sizeValue,
        itemCount: size.itemCount,
      })),
    [productSizes]
  );

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: 0,
    discount: 0,

    image: "/placeholder.svg",
    materialAndCare: "",
    productFeatures: [] as string[],
    sold: 0,
  });

  const { toast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [allCategories, setAllCategories] = useState([]);
  const [allSelectedCategories, setAllSelectedCategories] = useState([]);

  const [allSizes, setAllSizes] = useState([]);
  const [allSelectedSizes, setAllSelectedSizes] = useState([]);
  const [newSize, setNewSize] = useState({ size: "", itemCount: 0, type: "" });
  const [sizeType, setSizeType] = useState("");

  const [newFeature, setNewFeature] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileImage, setFileImage] = useState(null);
  const oldImage = useRef("");

  useEffect(() => {
    setAllCategories(categories);
    setAllSizes(sizes);

    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        price: initialData.price,
        discount: initialData.discount,
        image: initialData.image,
        materialAndCare: initialData.materialAndCare,
        productFeatures: [...initialData.productFeatures],
        sold: initialData.sold,
      });
      setAllSelectedCategories(allProductcategoriesIds);
      setAllSelectedSizes(productSizesFormat);
    } else {
      setFormData({
        title: "",
        description: "",
        price: 0,
        discount: 0,
        image: "/placeholder.svg",
        materialAndCare: "",
        productFeatures: [],
        sold: 0,
      });
      setAllSelectedCategories([]);
      setAllSelectedSizes([]);
    }
  }, [
    categories,
    sizes,
    initialData,
    allProductcategoriesIds,
    productSizesFormat,
  ]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const reader = new FileReader();
      oldImage.current = formData.image;
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }

    setFileImage(file);
  };

  const handleAddCategory = () => {
    if (selectedCategory) {
      const selectedItem = allCategories.find(
        (category) => category.category === selectedCategory
      );

      setAllSelectedCategories([...allSelectedCategories, selectedItem.id]);
      setSelectedCategory("");
    }
  };

  const handleRemoveCategory = (category: string) => {
    setAllSelectedCategories((prev) =>
      prev.filter((categoryId) => categoryId !== category)
    );
  };

  const handleAddSize = () => {
    if (newSize.size.trim() && newSize.itemCount > 0 && newSize.type) {
      const newSizeId = allSizes
        .filter((size) => size.sizeType === newSize.type.toLowerCase())
        .find((size) => size.sizeValue === newSize.size).id;

      setAllSelectedSizes((prev) => [
        ...prev,
        {
          id: newSizeId,
          size: newSize.size,
          itemCount: newSize.itemCount,
        },
      ]);

      setNewSize({ size: "", itemCount: 0, type: "" });
      setSizeType("");
    }
  };

  const handleRemoveSize = (sizeId: string) => {
    setAllSelectedSizes((prev) => prev.filter((s) => s.id !== sizeId));
  };

  const handleAddFeature = () => {
    if (
      newFeature.trim() &&
      !formData.productFeatures.includes(newFeature.trim())
    ) {
      setFormData({
        ...formData,
        productFeatures: [...formData.productFeatures, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const handleRemoveFeature = (feature: string) => {
    setFormData({
      ...formData,
      productFeatures: formData.productFeatures.filter((f) => f !== feature),
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      toast({
        title: "Missing Title",
        description: "Please enter a product title.",
        variant: "destructive",
      });
      return;
    }

    if (formData.price === 0) {
      toast({
        title: "Invalid Price",
        description: "Price must be greater than zero.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.description) {
      toast({
        title: "Missing Description",
        description: "Please enter a product description.",
        variant: "destructive",
      });
      return;
    }

    if (allSelectedSizes.length === 0) {
      toast({
        title: "No Size Added",
        description: "Please add at least one size for the product.",
        variant: "destructive",
      });
      return;
    }

    if (formData.image === "/placeholder.svg") {
      toast({
        title: "No image",
        description: "Please upload image for product.",
        variant: "destructive",
      });
      return;
    }

    if (allSelectedCategories.length === 0) {
      toast({
        title: "No Category Selected",
        description: "Please select at least one category for the product.",
        variant: "destructive",
      });
      return;
    }

    if (fileImage) {
      // Check file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(fileImage.type)) {
        toast({
          variant: "destructive",
          title: "Profile update failed",
          description:
            "Please select a valid image file (JPEG, PNG, GIF, WEBP)",
        });
        return;
      }

      // Check file size (max 2MB)
      if (fileImage.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Profile update failed",
          description: "Image is too large. Maximum size is 2MB",
        });
        return;
      }
    }

    const newDatas = {
      newImage: fileImage,
      oldImageUrl: oldImage.current,
      newProduct: { ...formData },
      newProductSizes: allSelectedSizes,
      newProductCategoryIds: allSelectedCategories,
    };

    if (!initialData) {
      createProduct(newDatas, {
        onSuccess: () => {
          toast({
            title: "Product Saved",
            description:
              "The product, categories, and sizes were successfully saved.",
          });
          onClose();
        },
        onError: (error) => {
          toast({
            title: "Failed to Save Product",
            description: `Something went wrong. Error: ${error.message}`,
            variant: "destructive",
          });
          onClose();
        },
      });

      return;
    }

    editProduct(
      { newDatas, id: initialData?.id },
      {
        onSuccess: () => {
          toast({
            title: "Product Updated",
            description:
              "The product and its categories and sizes were successfully saved.",
          });
          onClose();
        },
        OnError: (error) => {
          toast({
            title: "Error",
            description: `something weng wrong! error: ${error.message}`,
            variant: "destructive",
          });
          onClose();
        },
      }
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  disabled={isEditting || isCreating}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        price: parseFloat(e.target.value) || 0,
                      })
                    }
                    required
                    disabled={isEditting || isCreating}
                  />
                </div>
                <div>
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discount: parseInt(e.target.value) || 0,
                      })
                    }
                    disabled={isEditting || isCreating}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  disabled={isEditting || isCreating}
                />
              </div>

              <div>
                <Label htmlFor="materialAndCare">Material & Care</Label>
                <Textarea
                  id="materialAndCare"
                  value={formData.materialAndCare}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      materialAndCare: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="e.g., 100% Cotton. Machine wash cold, tumble dry low."
                  disabled={isEditting || isCreating}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label>Product Image</Label>
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={formData.image}
                      alt="Product preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden"
                      disabled={isEditting || isCreating}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full"
                      disabled={isEditting || isCreating}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <Label>Categories</Label>
                <div className="flex gap-2 mb-2">
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                    disabled={
                      allCategories?.length === allSelectedCategories?.length ||
                      isEditting ||
                      isCreating
                    }
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {allCategories
                        ?.filter(
                          (category) =>
                            !allSelectedCategories?.includes(category.id)
                        )
                        .map((category) => (
                          <SelectItem
                            key={category.id}
                            value={category.category}
                          >
                            {category.category}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={handleAddCategory}
                    disabled={
                      !selectedCategory ||
                      allCategories.length === allSelectedCategories.length ||
                      isEditting ||
                      isCreating
                    }
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {allCategories
                    ?.filter((category) =>
                      allSelectedCategories?.includes(category.id)
                    )
                    .map((category) => (
                      <Badge
                        key={category.id}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {category.category}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => handleRemoveCategory(category.id)}
                        />
                      </Badge>
                    ))}
                </div>
              </div>

              <div>
                <Label>Product Features</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add feature"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      (e.preventDefault(), handleAddFeature())
                    }
                    disabled={isEditting || isCreating}
                  />
                  <Button
                    type="button"
                    onClick={handleAddFeature}
                    disabled={isEditting || isCreating}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.productFeatures.map((feature) => (
                    <Badge
                      key={feature}
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      {feature}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => handleRemoveFeature(feature)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <Label>Sizes & Stock</Label>
            <p className="text-xs text-slate-500 my-1">
              Note: If there is no size, enter{" "}
              <span className="font-medium text-slate-600">"none"</span>.
            </p>

            <div className="flex gap-2 mb-2">
              <Select
                value={sizeType}
                onValueChange={(value) => {
                  setNewSize({ ...newSize, type: value });
                  setSizeType(value);
                }}
                disabled={isEditting || isCreating}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {typeOptions.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={newSize.size}
                onValueChange={(value) =>
                  setNewSize({ ...newSize, size: value })
                }
                disabled={sizeType === "" || isEditting || isCreating}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {allSizes
                    ?.filter(
                      (size) => size.sizeType === sizeType.toLocaleLowerCase()
                    )
                    .filter(
                      (size) =>
                        !allSelectedSizes
                          .map((item) => item.id)
                          .includes(size.id)
                    )
                    .map((size) => (
                      <SelectItem key={size.id} value={size.sizeValue}>
                        {size.sizeValue}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              <Input
                type="number"
                min="0"
                value={newSize.itemCount}
                onChange={(e) =>
                  setNewSize({
                    ...newSize,
                    itemCount: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="Stock"
                disabled={isEditting || isCreating}
              />
              <Button
                type="button"
                onClick={handleAddSize}
                disabled={isEditting || isCreating}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {allSelectedSizes.map((sizeInfo) => (
                <Badge
                  key={sizeInfo.id}
                  variant="outline"
                  className="flex items-center gap-1"
                >
                  {sizeInfo.size}: {sizeInfo.itemCount}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => handleRemoveSize(sizeInfo.id)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isEditting || isCreating}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isCreating || isEditting}>
              {isCreating || isEditting ? (
                <>
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  {initialData ? "Updating..." : "Creating..."}
                </>
              ) : initialData ? (
                "Update Product"
              ) : (
                "Add Product"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
