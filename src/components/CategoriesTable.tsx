import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CategoryForm } from "@/components/CategoryForm";
import { Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import SpinnerMini from "@/components/ui/SpinnerMini";
import { useCategories } from "@/customs/category/useCategories";
import { useCreateEditCategory } from "@/customs/category/useCreateEditCategory";
import { useDeleteCategory } from "@/customs/category/useDeleteCategory";

export const CategoriesTable = () => {
  const { categories, isPending } = useCategories();
  const { createEditCategory, isCreatingEditting } = useCreateEditCategory();
  const { deleteCategory, isDeleting } = useDeleteCategory();

  const { toast } = useToast();
  const [test, setCategories] = useState([
    { id: "1", name: "Electronics", image: "/placeholder.svg", itemCount: 25 },
    { id: "2", name: "Clothing", image: "/placeholder.svg", itemCount: 48 },
    { id: "3", name: "Books", image: "/placeholder.svg", itemCount: 15 },
    {
      id: "4",
      name: "Home & Garden",
      image: "/placeholder.svg",
      itemCount: 32,
    },
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field) => {
    // if (sortField === field) {
    //   setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    // } else {
    //   setSortField(field);
    //   setSortDirection("asc");
    // }
  };

  // const sortedCategories = [...categories].sort((a, b) => {
  // const aValue = a[sortField];
  // const bValue = b[sortField];

  // if (typeof aValue === "string" && typeof bValue === "string") {
  //   return sortDirection === "asc"
  //     ? aValue.localeCompare(bValue)
  //     : bValue.localeCompare(aValue);
  // }

  // if (typeof aValue === "number" && typeof bValue === "number") {
  //   return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
  // }

  //   return 0;
  // });

  const handleAddCategory = (categoryData) => {
    if (categoryData.fileImage.current) {
      // Check file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(categoryData.fileImage.current.type)) {
        toast({
          variant: "destructive",
          title: "Profile update failed",
          description:
            "Please select a valid image file (JPEG, PNG, GIF, WEBP)",
        });
        return;
      }

      // Check file size (max 2MB)
      if (categoryData.fileImage.current.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Profile update failed",
          description: "Image is too large. Maximum size is 2MB",
        });
        return;
      }
    }

    createEditCategory(
      {
        category: categoryData.name,
        image: categoryData.fileImage.current,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast({
            title: "Category Created",
            description: "The category was added successfully.",
          });
        },
        onError: (error) => {
          setIsDialogOpen(false);
          toast({
            title: "Failed to Create Category",
            description: `An error occurred: ${error.message}`,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleEditCategory = (categoryData) => {
    if (!editingCategory) return;

    if (categoryData.fileImage.current) {
      // Check file type
      const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!validTypes.includes(categoryData.fileImage.current.type)) {
        toast({
          variant: "destructive",
          title: "Profile update failed",
          description:
            "Please select a valid image file (JPEG, PNG, GIF, WEBP)",
        });
        return;
      }

      // Check file size (max 2MB)
      if (categoryData.fileImage.current.size > 2 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "Profile update failed",
          description: "Image is too large. Maximum size is 2MB",
        });
        return;
      }
    }

    createEditCategory(
      {
        category: categoryData.name,
        image:
          categoryData.fileImage.current === null
            ? categoryData.image
            : categoryData.fileImage.current,
        id: categoryData.id,
      },
      {
        onSuccess: () => {
          setIsDialogOpen(false);
          toast({
            title: "Category Created",
            description: "The category was added successfully.",
          });
        },
        onError: (error) => {
          setIsDialogOpen(false);
          toast({
            title: "Failed to Create Category",
            description: `An error occurred: ${error.message}`,
            variant: "destructive",
          });
        },
      }
    );
  };

  const handleDeleteCategory = (id) => {
    deleteCategory(id, {
      onSuccess: () => {
        setIsDialogOpen(false);
        toast({
          title: "Category Deleted",
          description: "The category was deleted successfully.",
        });
      },
      onError: (error) => {
        setIsDialogOpen(false);
        toast({
          title: "Failed to Delete Category",
          description: `An error occurred: ${error.message}`,
          variant: "destructive",
        });
      },
    });
  };

  const openEditDialog = (category) => {
    setEditingCategory(category);
    setIsDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingCategory(null);
    setIsDialogOpen(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Categories</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddDialog}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? "Edit Category" : "Add New Category"}
                </DialogTitle>
              </DialogHeader>
              <CategoryForm
                category={editingCategory}
                onSubmit={
                  editingCategory ? handleEditCategory : handleAddCategory
                }
                onCancel={() => setIsDialogOpen(false)}
                isLoading={isCreatingEditting}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("name")}
              >
                Name{" "}
                {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("itemCount")}
              >
                Item Count{" "}
                {sortField === "itemCount" &&
                  (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isPending || isDeleting ? (
              <TableRow className="h-[40vh]">
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell>
                  <SpinnerMini />
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            ) : (
              categories?.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>
                    <img
                      src={category.image}
                      alt={category.category}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    {category.category}
                  </TableCell>
                  <TableCell>{category.itemCount} items</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => openEditDialog(category)}
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
