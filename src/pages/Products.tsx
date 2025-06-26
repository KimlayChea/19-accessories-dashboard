import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Plus, Search, Edit, Trash2, Eye, ArrowUpDown } from "lucide-react";
import { ProductForm } from "@/components/ProductForm";
import { ProductDetails } from "@/components/ProductDetails";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import SpinnerMini from "../components/ui/SpinnerMini";
import ProductCategories from "@/components/ProductCategories";
import ProductSizes from "@/components/ProductSizes";
import ProductStock from "@/components/ProductStock";
import { useProducts } from "../customs/product/useProducts";
import { useDeleteProduct } from "@/customs/product/useDeleteProduct";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  discount: number;
  sold: number;
  image: string;
  materialAndCare: string;
  productFeatures: string[];
  created_at: Date;
}

type SortBy = "date" | "price" | "discount" | "stock" | "name";
type SortOrder = "asc" | "desc";

const Products = () => {
  const { toast } = useToast();
  const { products, isPending } = useProducts();
  const { deleteProduct, isDeleting } = useDeleteProduct();

  // const [products, setProducts] = useState<Product[]>([
  //   {
  //     id: "1",
  //     name: "Premium T-Shirt",
  //     description: "High-quality cotton t-shirt with modern fit",
  //     price: 29.99,
  //     discount: 10,
  //     categories: ["Clothing", "Men", "Casual"],
  //     sizes: [
  //       { size: "S", stock: 15 },
  //       { size: "M", stock: 20 },
  //       { size: "L", stock: 18 },
  //       { size: "XL", stock: 10 },
  //     ],
  //     totalStock: 63,
  //     sold: 5,
  //     image: "/placeholder.svg",
  //     materialAndCare: "100% Cotton. Machine wash cold, tumble dry low.",
  //     productFeatures: ["Soft fabric", "Modern fit", "Breathable", "Durable"],
  //     createdAt: new Date("2024-01-15"),
  //   },
  //   {
  //     id: "2",
  //     name: "Wireless Headphones",
  //     description: "Noise-cancelling wireless headphones with premium sound",
  //     price: 199.99,
  //     discount: 15,
  //     categories: ["Electronics", "Audio", "Wireless"],
  //     sizes: [{ size: "One Size", stock: 25 }],
  //     totalStock: 25,
  //     sold: 12,
  //     image: "/placeholder.svg",
  //     materialAndCare: "Wipe clean with dry cloth. Avoid moisture.",
  //     productFeatures: [
  //       "Noise cancelling",
  //       "35-hour battery",
  //       "Wireless",
  //       "Premium sound",
  //     ],
  //     createdAt: new Date("2024-01-20"),
  //   },
  // ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const sortProducts = (
    products: Product[],
    sortBy: SortBy,
    sortOrder: SortOrder
  ) => {
    // return [...products].sort((a, b) => {
    //   let aValue: any, bValue: any;
    //   switch (sortBy) {
    //     case "date":
    //       aValue = a.createdAt.getTime();
    //       bValue = b.createdAt.getTime();
    //       break;
    //     case "price":
    //       aValue = a.price;
    //       bValue = b.price;
    //       break;
    //     case "discount":
    //       aValue = a.discount;
    //       bValue = b.discount;
    //       break;
    //     case "stock":
    //       aValue = a.totalStock;
    //       bValue = b.totalStock;
    //       break;
    //     case "name":
    //       aValue = a.name.toLowerCase();
    //       bValue = b.name.toLowerCase();
    //       break;
    //     default:
    //       return 0;
    //   }
    //   if (sortOrder === "asc") {
    //     return aValue > bValue ? 1 : -1;
    //   } else {
    //     return aValue < bValue ? 1 : -1;
    //   }
    // });
  };

  const filteredAndSortedProducts = sortProducts(
    products?.filter(
      (product) =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      //  ||
      // productCategories?.some((cat) =>
      //   cat.toLowerCase().includes(searchQuery.toLowerCase())
      // )
    ),
    sortBy,
    sortOrder
  );

  const handleDeleteProduct = (product: Product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete.id, {
        onSuccess: () => {
          setProductToDelete(null);
          setDeleteDialogOpen(false);
          toast({
            title: "Product Deleted",
            description:
              "The product and its related data were successfully removed.",
          });
        },
        onError: (error) => {
          setProductToDelete(null);
          setDeleteDialogOpen(false);
          toast({
            title: "Failed to Delete Product",
            description: `Something went wrong. Error: ${error.message}`,
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailsOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount) / 100;
  };

  // const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);
  // const startIndex = (currentPage - 1) * itemsPerPage;
  // const paginatedProducts = filteredAndSortedProducts.slice(
  //   startIndex,
  //   startIndex + itemsPerPage
  // );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <AppSidebar />
        <div className="flex-1">
          <DashboardHeader />

          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                <p className="text-gray-600">Manage your product inventory</p>
              </div>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search products, descriptions, or categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select
                      value={sortBy}
                      onValueChange={(value: SortBy) => setSortBy(value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="date">Date</SelectItem>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="discount">Discount</SelectItem>
                        <SelectItem value="stock">Stock</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                      }
                      className="flex items-center space-x-1"
                    >
                      <ArrowUpDown className="w-4 h-4" />
                      <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isPending || isDeleting ? (
                  <div className="w-full h-[25rem] flex flex-col justify-center items-center gap-4">
                    <SpinnerMini />
                    <p className="text-stone-600">Loading products...</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* paginatedProducts */}
                    {products?.map((product) => (
                      <Card
                        key={product.id}
                        className="hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50"
                      >
                        <CardContent className="p-5">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center shadow-sm border-2 border-white">
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.svg";
                                  }}
                                />
                              </div>
                              <div>
                                <Badge
                                  variant="outline"
                                  className="text-xs font-mono bg-blue-50 text-blue-700 border-blue-200"
                                >
                                  ID: {product.id}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex space-x-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(product)}
                                className="hover:bg-blue-100 hover:text-blue-600 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditProduct(product)}
                                className="hover:bg-green-100 hover:text-green-600 transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteProduct(product)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-100 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>

                          <h3 className="font-bold text-lg mb-2 text-gray-900">
                            {product.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>

                          <ProductCategories productId={product.id} />

                          <div className="flex justify-between items-center mb-4 bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center space-x-2">
                              {product.discount > 0 ? (
                                <>
                                  <span className="text-xl font-bold text-green-600">
                                    $
                                    {calculateDiscountedPrice(
                                      product.price,
                                      product.discount
                                    ).toFixed(2)}
                                  </span>
                                  <span className="text-sm text-gray-500 line-through">
                                    ${product.price.toFixed(2)}
                                  </span>
                                  <Badge
                                    variant="destructive"
                                    className="text-xs bg-red-100 text-red-700 hover:bg-red-200"
                                  >
                                    -{product.discount}%
                                  </Badge>
                                </>
                              ) : (
                                <span className="text-xl font-bold text-green-600">
                                  ${product.price.toFixed(2)}
                                </span>
                              )}
                            </div>

                            <div className="flex flex-col items-end text-sm">
                              <ProductStock productId={product.id} />
                              <span className="text-gray-500">
                                Sold: {product.sold}
                              </span>
                            </div>
                          </div>

                          <ProductSizes productId={product.id} />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* paginatedProducts */}
                {products?.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">
                      No products found matching your search.
                    </p>
                  </div>
                )}

                {/* {totalPages > 1 && (
                  <div className="mt-6">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() =>
                              handlePageChange(Math.max(1, currentPage - 1))
                            }
                            className={
                              currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>

                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1
                        ).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}

                        <PaginationItem>
                          <PaginationNext
                            onClick={() =>
                              handlePageChange(
                                Math.min(totalPages, currentPage + 1)
                              )
                            }
                            className={
                              currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                            }
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )} */}
              </CardContent>
            </Card>

            <ProductForm
              isOpen={isFormOpen}
              onClose={() => {
                setIsFormOpen(false);
                setEditingProduct(null);
              }}
              // onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
              initialData={editingProduct}
              title={editingProduct ? "Edit Product" : "Add New Product"}
            />

            <ProductDetails
              isOpen={isDetailsOpen}
              onClose={() => setIsDetailsOpen(false)}
              product={selectedProduct}
            />

            <AlertDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
            >
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    the product "{productToDelete?.title}" from your inventory.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={confirmDelete}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Products;
