
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", sales: 4000, orders: 240 },
  { name: "Feb", sales: 3000, orders: 220 },
  { name: "Mar", sales: 2000, orders: 180 },
  { name: "Apr", sales: 2780, orders: 200 },
  { name: "May", sales: 1890, orders: 160 },
  { name: "Jun", sales: 2390, orders: 190 },
  { name: "Jul", sales: 3490, orders: 280 },
  { name: "Aug", sales: 4200, orders: 320 },
  { name: "Sep", sales: 3800, orders: 290 },
  { name: "Oct", sales: 4100, orders: 310 },
  { name: "Nov", sales: 4500, orders: 340 },
  { name: "Dec", sales: 5200, orders: 380 },
];

export const SalesChart = () => {
  return (
    <Card className="border-0 bg-white/70 backdrop-blur-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">Sales Overview</CardTitle>
        <p className="text-gray-600">Monthly sales and order trends</p>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                className="text-gray-600"
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                className="text-gray-600"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sales" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#3B82F6", strokeWidth: 2 }}
              />
              <Line 
                type="monotone" 
                dataKey="orders" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ fill: "#10B981", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#10B981", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
