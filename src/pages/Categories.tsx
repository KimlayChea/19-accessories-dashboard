
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { CategoriesTable } from "@/components/CategoriesTable";

const Categories = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <AppSidebar />
        <div className="flex-1">
          <DashboardHeader />
          
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
              <p className="text-gray-600">Manage your product categories</p>
            </div>
            
            <CategoriesTable />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Categories;
