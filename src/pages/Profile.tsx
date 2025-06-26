
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ProfileForm } from "@/components/ProfileForm";

const Profile = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <AppSidebar />
        <div className="flex-1">
          <DashboardHeader />
          
          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600">Manage your account information and security</p>
            </div>
            
            <div className="max-w-2xl">
              <ProfileForm />
            </div>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Profile;
