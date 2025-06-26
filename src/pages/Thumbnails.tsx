
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { ThumbnailForm } from "@/components/ThumbnailForm";
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

export interface Thumbnail {
  id: string;
  title: string;
  description: string;
  image: string;
  status: "active" | "inactive";
  categories: string[];
  createdAt: Date;
}

const Thumbnails = () => {
  const [thumbnails, setThumbnails] = useState<Thumbnail[]>([
    {
      id: "1",
      title: "Hero Banner",
      description: "Main hero banner for homepage",
      image: "/placeholder.svg",
      status: "active",
      categories: ["Hero Banners", "Promotional"],
      createdAt: new Date("2024-01-15")
    },
    {
      id: "2",
      title: "Product Showcase",
      description: "Featured product showcase thumbnail",
      image: "/placeholder.svg",
      status: "inactive",
      categories: ["Product Showcase"],
      createdAt: new Date("2024-01-20")
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editingThumbnail, setEditingThumbnail] = useState<Thumbnail | null>(null);
  const [thumbnailToDelete, setThumbnailToDelete] = useState<Thumbnail | null>(null);

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

  const filteredThumbnails = thumbnails.filter(thumbnail => {
    const matchesSearch = thumbnail.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thumbnail.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thumbnail.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter === "all" || thumbnail.categories.includes(categoryFilter);
    
    return matchesSearch && matchesCategory;
  });

  const handleAddThumbnail = (thumbnailData: Omit<Thumbnail, "id" | "createdAt">) => {
    const newThumbnail: Thumbnail = {
      ...thumbnailData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setThumbnails([...thumbnails, newThumbnail]);
    setIsFormOpen(false);
  };

  const handleUpdateThumbnail = (thumbnailData: Omit<Thumbnail, "id" | "createdAt">) => {
    if (!editingThumbnail) return;
    
    const updatedThumbnail: Thumbnail = {
      ...thumbnailData,
      id: editingThumbnail.id,
      createdAt: editingThumbnail.createdAt
    };
    
    setThumbnails(thumbnails.map(t => t.id === editingThumbnail.id ? updatedThumbnail : t));
    setEditingThumbnail(null);
    setIsFormOpen(false);
  };

  const handleDeleteThumbnail = (thumbnail: Thumbnail) => {
    setThumbnailToDelete(thumbnail);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (thumbnailToDelete) {
      setThumbnails(thumbnails.filter(t => t.id !== thumbnailToDelete.id));
      setThumbnailToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleEditThumbnail = (thumbnail: Thumbnail) => {
    setEditingThumbnail(thumbnail);
    setIsFormOpen(true);
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
                <h1 className="text-3xl font-bold text-gray-900">Thumbnails</h1>
                <p className="text-gray-600">Manage your thumbnail images</p>
              </div>
              <Button onClick={() => setIsFormOpen(true)} className="flex items-center space-x-2">
                <Plus className="w-4 h-4" />
                <span>Add Thumbnail</span>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search thumbnails..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredThumbnails.map((thumbnail) => (
                    <Card key={thumbnail.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-4">
                        <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 mb-4">
                          <img 
                            src={thumbnail.image} 
                            alt={thumbnail.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "/placeholder.svg";
                            }}
                          />
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-2">{thumbnail.title}</h3>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{thumbnail.description}</p>
                        
                        <div className="flex justify-between items-center mb-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            thumbnail.status === 'active' ? 'text-green-700 bg-green-100' : 'text-gray-700 bg-gray-100'
                          }`}>
                            {thumbnail.status}
                          </span>
                          <span className="text-xs text-gray-500">
                            {thumbnail.createdAt.toLocaleDateString()}
                          </span>
                        </div>
                        
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {thumbnail.categories.map((category, index) => (
                              <span key={index} className="text-xs px-2 py-1 rounded bg-blue-100 text-blue-700">
                                {category}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditThumbnail(thumbnail)}
                            className="flex-1"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteThumbnail(thumbnail)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {filteredThumbnails.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No thumbnails found matching your search criteria.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <ThumbnailForm
              isOpen={isFormOpen}
              onClose={() => {
                setIsFormOpen(false);
                setEditingThumbnail(null);
              }}
              onSubmit={editingThumbnail ? handleUpdateThumbnail : handleAddThumbnail}
              initialData={editingThumbnail}
              title={editingThumbnail ? "Edit Thumbnail" : "Add New Thumbnail"}
            />

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the thumbnail "{thumbnailToDelete?.title}".
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
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

export default Thumbnails;
