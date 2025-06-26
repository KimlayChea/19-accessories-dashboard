
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, Users, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    title: "Total Revenue",
    value: "$124,567",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "bg-gradient-to-br from-green-500 to-emerald-600",
  },
  {
    title: "Orders",
    value: "2,456",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "bg-gradient-to-br from-blue-500 to-cyan-600",
  },
  {
    title: "Customers",
    value: "1,823",
    change: "+15.3%",
    trend: "up",
    icon: Users,
    color: "bg-gradient-to-br from-purple-500 to-violet-600",
  },
  {
    title: "Products",
    value: "342",
    change: "-2.1%",
    trend: "down",
    icon: Package,
    color: "bg-gradient-to-br from-orange-500 to-red-600",
  },
];

export const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card 
          key={stat.title} 
          className="hover:shadow-lg transition-all duration-300 border-0 bg-white/70 backdrop-blur-sm animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <div className="flex items-center mt-3">
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowDownRight className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-sm font-semibold ml-1 ${
                    stat.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">from last month</span>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
