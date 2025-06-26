import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { UserManagement } from "@/components/UserManagement";

const Admins = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <AppSidebar />
        <div className="flex-1">
          <DashboardHeader />

          <div className="p-6">
            <UserManagement />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Admins;
