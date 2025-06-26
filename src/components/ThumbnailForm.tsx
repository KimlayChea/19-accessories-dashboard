
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload } from "lucide-react";
import { Thumbnail } from "@/pages/Thumbnails";

interface ThumbnailFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (thumbnail: Omit<Thumbnail, "id" | "createdAt">) => void;
  initialData?: Thumbnail | null;
  title: string;
}

export const ThumbnailForm = ({ isOpen, onClose, onSubmit, initialData, title }: ThumbnailFormProps) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "/placeholder.svg",
    status: "active" as "active" | "inactive",
    categories: [] as string[]
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = [
    "Hero Banners",
    "Product Showcase",
    "Blog Posts",
    "Social Media",
    "Advertisements",
    "Promotional",
    "Educational",
    "Entertainment"
  ];

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description,
        image: initialData.image,
        status: initialData.status,
        categories: initialData.categories
      });
    } else {
      setFormData({
        title: "",
        description: "",
        image: "/placeholder.svg",
        status: "active",
        categories: []
      });
    }
  }, [initialData, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setFormData({ 
        ...formData, 
        categories: [...formData.categories, category] 
      });
    } else {
      setFormData({ 
        ...formData, 
        categories: formData.categories.filter(c => c !== category) 
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim()) {
      onSubmit(formData);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Brief description of the thumbnail..."
              />
            </div>

            <div>
              <Label>Categories</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                {categories.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={formData.categories.includes(category)}
                      onCheckedChange={(checked) => handleCategoryChange(category, !!checked)}
                    />
                    <Label htmlFor={category} className="text-sm font-normal">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Thumbnail Image</Label>
              <div className="space-y-4">
                <div className="aspect-video w-full max-w-md rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  <img 
                    src={formData.image} 
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {initialData ? "Update Thumbnail" : "Add Thumbnail"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
