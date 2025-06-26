import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

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

interface OrderDetailsProps {
  order: Order;
  onStatusUpdate: (orderId: string, newStatus: Order['status']) => void;
  onClose: () => void;
}

export const OrderDetails = ({ order, onStatusUpdate, onClose }: OrderDetailsProps) => {
  const handleStatusChange = (newStatus: string) => {
    onStatusUpdate(order.id, newStatus as Order['status']);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200';
      case 'processing': return 'bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200';
      case 'shipped': return 'bg-purple-100 text-purple-800 hover:bg-purple-200 border-purple-200';
      case 'delivered': return 'bg-green-100 text-green-800 hover:bg-green-200 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 hover:bg-red-200 border-red-200';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200';
    }
  };

  const calculateDiscountedPrice = (price: number, discount: number) => {
    return price - (price * discount / 100);
  };

  return (
    <ScrollArea className="h-[80vh] pr-4">
      <div className="space-y-6">
        {/* Order Header */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold text-2xl text-gray-900">{order.id}</h3>
              <p className="text-sm text-gray-600 mt-1">
                Order Date: {new Date(order.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
              {order.expressDelivery && order.expressCompany && (
                <div className="mt-2">
                  <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200">
                    Express Delivery by: {order.expressCompany}
                  </Badge>
                </div>
              )}
            </div>
            <Badge className={`${getStatusColor(order.status)} transition-all duration-200 cursor-default border`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Customer Information */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-lg mb-4 text-gray-900 flex items-center">
            <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
            Customer Information
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Name</p>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{order.customerName}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Email</p>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{order.customerEmail}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Phone</p>
              <p className="text-sm text-gray-900 bg-gray-50 p-2 rounded">{order.customerPhone}</p>
            </div>
          </div>
        </div>

        {/* Customer Address */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-lg mb-4 text-gray-900 flex items-center">
            <div className="w-2 h-6 bg-green-500 rounded-full mr-3"></div>
            Shipping Address
          </h4>
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="text-sm text-gray-900 space-y-1">
              <p className="font-medium">{order.customerAddress.street}</p>
              <p>{order.customerAddress.city}, {order.customerAddress.state} {order.customerAddress.zipCode}</p>
              <p className="text-gray-600">{order.customerAddress.country}</p>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Order Items */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-lg mb-4 text-gray-900 flex items-center">
            <div className="w-2 h-6 bg-purple-500 rounded-full mr-3"></div>
            Order Items ({order.items.length})
          </h4>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-sm transition-shadow">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center flex-shrink-0 border border-gray-200">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600 mt-1">Product ID: {item.productId}</p>
                  <div className="flex items-center mt-2">
                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  {item.discount > 0 ? (
                    <div className="space-y-2">
                      <p className="font-bold text-green-600 text-lg">
                        ${calculateDiscountedPrice(item.price, item.discount).toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500 line-through">
                        ${item.price.toFixed(2)}
                      </p>
                      <Badge variant="destructive" className="text-xs">
                        -{item.discount}% OFF
                      </Badge>
                    </div>
                  ) : (
                    <p className="font-bold text-lg text-gray-900">${item.price.toFixed(2)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Order Summary */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-lg mb-4 text-gray-900">Order Summary</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Total Quantity:</span>
              <span className="font-semibold text-gray-900 bg-white px-3 py-1 rounded-full border">
                {order.totalQuantity} items
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Payment Status:</span>
              <Badge className={order.isPaid 
                ? "bg-green-100 text-green-800 hover:bg-green-200 border-green-200" 
                : "bg-red-100 text-red-800 hover:bg-red-200 border-red-200"
              }>
                {order.isPaid ? "Paid" : "Unpaid"}
              </Badge>
            </div>
            {order.expressDelivery && order.expressCompany && (
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Delivery Method:</span>
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-200 border-orange-200">
                  Express Delivery by: {order.expressCompany}
                </Badge>
              </div>
            )}
            <div className="flex justify-between items-center text-xl pt-2 border-t border-gray-300">
              <span className="font-bold text-gray-900">Total Price:</span>
              <span className="font-bold text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-200">
                ${order.totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Status Update */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-lg mb-4 text-gray-900 flex items-center">
            <div className="w-2 h-6 bg-orange-500 rounded-full mr-3"></div>
            Update Status
          </h4>
          <div className="flex items-center space-x-4">
            <Select value={order.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[220px] h-11 border-2 border-gray-300 hover:border-blue-400 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-6">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="px-6 py-2 border-2 hover:bg-gray-50 transition-colors"
          >
            Close
          </Button>
        </div>
      </div>
    </ScrollArea>
  );
};
