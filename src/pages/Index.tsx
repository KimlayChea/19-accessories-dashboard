
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { StatsCards } from "@/components/StatsCards";
import { SalesChart } from "@/components/SalesChart";
import { RecentOrders } from "@/components/RecentOrders";
import { TopProducts } from "@/components/TopProducts";

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <AppSidebar />
        <div className="flex-1">
          <DashboardHeader />
          
          <main className="container mx-auto px-6 py-8">
            {/* Stats Overview */}
            <StatsCards />
            
            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
              <div className="lg:col-span-2">
                <SalesChart />
              </div>
              <div className="lg:col-span-1">
                <TopProducts />
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="mt-8">
              <RecentOrders />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
