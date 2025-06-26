import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// interface Category {
//   id: string;
//   name: string;
//   image: string;
//   itemCount: number;
// }

// interface CategoryFormProps {
//   category?: Category | null;
//   onSubmit: (
//     data: Omit<Category, "id" | "itemCount"> & { itemCount: number }
//   ) => void;
//   onCancel: () => void;
// }

export const CategoryForm = ({ category, onSubmit, onCancel, isLoading }) => {
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    id: "",
  });
  const fileImage = useRef(null);

  useEffect(() => {
    if (category) {
      setFormData({
        id: category.id,
        name: category.category,
        image: category.image,
      });
    } else {
      setFormData({
        name: "",
        image: "",
        id: "",
      });
    }
  }, [category]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate a random item count for now since we removed the input
    // const itemCount = Math.floor(Math.random() * 50) + 1;
    onSubmit({ ...formData, fileImage });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      fileImage.current = file;
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          image: event.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter category name"
          required
        />
      </div>

      <div>
        <Label htmlFor="image">Category Image</Label>
        <Input
          id="image"
          name="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          required={!category}
        />
        {formData.image && (
          <div className="mt-2">
            <img
              src={formData.image}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
              {category ? "Updating..." : "Creating..."}
            </>
          ) : category ? (
            "Update Category"
          ) : (
            "Add Category"
          )}
        </Button>
      </div>
    </form>
  );
};
