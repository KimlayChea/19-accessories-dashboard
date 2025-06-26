
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

const products = [
  {
    name: "Wireless Headphones",
    sales: 1234,
    revenue: "$24,680",
    change: "+15%",
    image: "🎧",
  },
  {
    name: "Smart Watch",
    sales: 987,
    revenue: "$19,740",
    change: "+8%",
    image: "⌚",
  },
  {
    name: "Laptop Stand",
    sales: 756,
    revenue: "$15,120",
    change: "+12%",
    image: "💻",
  },
  {
    name: "Phone Case",
    sales: 654,
    revenue: "$9,810",
    change: "+5%",
    image: "📱",
  },
  {
    name: "USB Cable",
    sales: 543,
    revenue: "$5,430",
    change: "+3%",
    image: "🔌",
  },
];

export const TopProducts = () => {
  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">Top Products</CardTitle>
        <p className="text-gray-600">Best performing products this month</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {products.map((product, index) => (
            <div
              key={product.name}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-lg">
                  {product.image}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.sales} sold</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">{product.revenue}</p>
                <div className="flex items-center text-green-600 text-sm">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {product.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
