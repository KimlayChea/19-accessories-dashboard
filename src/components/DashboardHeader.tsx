import { Bell, ShoppingBag, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { useAuthUser } from "@/customs/authentication/useAuthUser";

export const DashboardHeader = () => {
  const { user } = useAuthUser();
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <SidebarTrigger />
            <div className="flex items-center space-x-3">
              <img
                className="rounded-full object-cover h-10 w-10"
                src="/logo.jpg"
                alt="logo"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  19 Accessories
                </h1>
                <p className="text-sm text-gray-600">Admin Dashboard</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button> */}

            <Link to="/profile">
              {user.user_metadata.avatar ? (
                <img
                  className="w-8 h-8 rounded-full object-cover p-[1px] border border-ring"
                  src={user.user_metadata.avatar}
                  alt={user.user_metadata.fullName}
                />
              ) : (
                <User className="w-6 h-6" />
              )}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
