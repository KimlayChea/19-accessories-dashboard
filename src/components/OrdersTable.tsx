import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { OrderDetails } from "@/components/OrderDetails";
import { Eye, Filter, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface OrderItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  discount: number;
  image: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalQuantity: number;
  totalPrice: number;
  date: string;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  items: OrderItem[];
  expressDelivery: boolean;
  expressCompany?: string;
  isPaid: boolean;
}

export const OrdersTable = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customerName: "John Doe",
      customerEmail: "john@example.com",
      customerPhone: "+1 (555) 123-4567",
      customerAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA"
      },
      totalQuantity: 3,
      totalPrice: 299.99,
      date: "2024-01-15",
      status: "pending",
      expressDelivery: true,
      expressCompany: "FastShip Express",
      isPaid: true,
      items: [
        { 
          id: "1", 
          productId: "PROD-001",
          name: "Wireless Headphones", 
          quantity: 1, 
          price: 199.99, 
          discount: 10,
          image: "/placeholder.svg"
        },
        { 
          id: "2", 
          productId: "PROD-002",
          name: "Phone Case", 
          quantity: 2, 
          price: 50.00, 
          discount: 0,
          image: "/placeholder.svg"
        },
      ],
    },
    {
      id: "ORD-002",
      customerName: "Jane Smith",
      customerEmail: "jane@example.com",
      customerPhone: "+1 (555) 987-6543",
      customerAddress: {
        street: "456 Oak Ave",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90210",
        country: "USA"
      },
      totalQuantity: 2,
      totalPrice: 149.99,
      date: "2024-01-14",
      status: "shipped",
      expressDelivery: false,
      isPaid: false,
      items: [
        { 
          id: "3", 
          productId: "PROD-003",
          name: "Bluetooth Speaker", 
          quantity: 1, 
          price: 99.99, 
          discount: 20,
          image: "/placeholder.svg"
        },
        { 
          id: "4", 
          productId: "PROD-004",
          name: "USB Cable", 
          quantity: 1, 
          price: 50.00, 
          discount: 0,
          image: "/placeholder.svg"
        },
      ],
    },
    {
      id: "ORD-003",
      customerName: "Bob Johnson",
      customerEmail: "bob@example.com",
      customerPhone: "+1 (555) 456-7890",
      customerAddress: {
        street: "789 Pine St",
        city: "Chicago",
        state: "IL",
        zipCode: "60601",
        country: "USA"
      },
      totalQuantity: 1,
      totalPrice: 79.99,
      date: "2024-01-13",
      status: "delivered",
      expressDelivery: true,
      expressCompany: "QuickDeliver Pro",
      isPaid: true,
      items: [
        { 
          id: "5", 
          productId: "PROD-005",
          name: "Smartphone Stand", 
          quantity: 1, 
          price: 79.99, 
          discount: 15,
          image: "/placeholder.svg"
        },
      ],
    },
  ]);

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<keyof Order>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const handleSort = (field: keyof Order) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = statusFilter === "all" || order.status === statusFilter;
    const matchesSearch = searchQuery === "" || 
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' 
        ? aValue - bValue
        : bValue - aValue;
    }
    
    return 0;
  });

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus }
        : order
    ));
    toast({
      title: "Success",
      description: "Order status updated successfully",
    });
  };

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = sortedOrders.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold text-gray-900">Orders Management</CardTitle>
          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64 border-2 border-gray-300 hover:border-blue-400 transition-colors"
              />
            </div>
            
            {/* Filter Dropdown */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] border-2 border-gray-300 hover:border-blue-400 transition-colors">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="border-b-2 border-gray-200">
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 transition-colors font-semibold text-gray-700 py-4" 
                  onClick={() => handleSort('id')}
                >
                  Order ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="font-semibold text-gray-700">Customer</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 transition-colors font-semibold text-gray-700" 
                  onClick={() => handleSort('totalQuantity')}
                >
                  Quantity {sortField === 'totalQuantity' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 transition-colors font-semibold text-gray-700" 
                  onClick={() => handleSort('totalPrice')}
                >
                  Total {sortField === 'totalPrice' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-100 transition-colors font-semibold text-gray-700" 
                  onClick={() => handleSort('date')}
                >
                  Date {sortField === 'date' && (sortDirection === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Payment</TableHead>
                <TableHead className="font-semibold text-gray-700">Delivery</TableHead>
                <TableHead className="font-semibold text-gray-700">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order.id} className="hover:bg-blue-50 transition-colors border-b border-gray-100">
                  <TableCell className="font-semibold text-gray-900 py-4">{order.id}</TableCell>
                  <TableCell className="py-4">
                    <div className="space-y-1">
                      <div className="font-medium text-gray-900">{order.customerName}</div>
                      <div className="text-sm text-gray-600">{order.customerEmail}</div>
                    </div>
                  </TableCell>
                  <TableCell className="py-4">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm font-medium">
                      {order.totalQuantity}
                    </span>
                  </TableCell>
                  <TableCell className="font-bold text-green-600 py-4">${order.totalPrice.toFixed(2)}</TableCell>
                  <TableCell className="text-gray-700 py-4">{new Date(order.date).toLocaleDateString()}</TableCell>
                  <TableCell className="py-4">
                    <Badge className={`${getStatusColor(order.status)} border transition-all duration-200`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge className={order.isPaid 
                      ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200" 
                      : "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
                    }>
                      {order.isPaid ? "Paid" : "Unpaid"}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4">
                    {order.expressDelivery && order.expressCompany ? (
                      <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200 text-xs">
                        Express by: {order.expressCompany}
                      </Badge>
                    ) : (
                      <span className="text-sm text-gray-500">Standard</span>
                    )}
                  </TableCell>
                  <TableCell className="py-4">
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => openOrderDetails(order)}
                      className="hover:bg-blue-100 hover:text-blue-600 transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 mb-4 px-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-blue-50"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => handlePageChange(page)}
                      isActive={currentPage === page}
                      className="cursor-pointer hover:bg-blue-50"
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer hover:bg-blue-50"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}

        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">Order Details</DialogTitle>
            </DialogHeader>
            {selectedOrder && (
              <OrderDetails 
                order={selectedOrder} 
                onStatusUpdate={handleStatusUpdate}
                onClose={() => setIsDetailsOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
