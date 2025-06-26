
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

const orders = [
  {
    id: "#ORD-001",
    customer: "John Doe",
    email: "john@example.com",
    product: "Wireless Headphones",
    amount: "$199.99",
    status: "completed",
    date: "2024-01-15",
  },
  {
    id: "#ORD-002",
    customer: "Sarah Smith",
    email: "sarah@example.com",
    product: "Smart Watch",
    amount: "$299.99",
    status: "pending",
    date: "2024-01-15",
  },
  {
    id: "#ORD-003",
    customer: "Mike Johnson",
    email: "mike@example.com",
    product: "Laptop Stand",
    amount: "$79.99",
    status: "processing",
    date: "2024-01-14",
  },
  {
    id: "#ORD-004",
    customer: "Emily Davis",
    email: "emily@example.com",
    product: "Phone Case",
    amount: "$24.99",
    status: "completed",
    date: "2024-01-14",
  },
  {
    id: "#ORD-005",
    customer: "Chris Wilson",
    email: "chris@example.com",
    product: "USB Cable",
    amount: "$12.99",
    status: "cancelled",
    date: "2024-01-13",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "processing":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

export const RecentOrders = () => {
  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">Recent Orders</CardTitle>
        <p className="text-gray-600">Latest customer orders and their status</p>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Order ID</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Customer</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Product</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Amount</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-2">
                    <span className="font-mono text-sm font-semibold text-blue-600">{order.id}</span>
                  </td>
                  <td className="py-4 px-2">
                    <div>
                      <p className="font-semibold text-gray-900">{order.customer}</p>
                      <p className="text-sm text-gray-600">{order.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-gray-900">{order.product}</span>
                  </td>
                  <td className="py-4 px-2">
                    <span className="font-bold text-gray-900">{order.amount}</span>
                  </td>
                  <td className="py-4 px-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="py-4 px-2">
                    <span className="text-gray-600">{order.date}</span>
                  </td>
                  <td className="py-4 px-2">
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
