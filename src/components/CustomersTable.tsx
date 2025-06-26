import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, Eye, ArrowUpDown } from "lucide-react";
import { Customer } from "@/pages/Customers";
import { useUpdateStatus } from "@/customs/customerMessage/useUpdateStatus";
import { useToast } from "@/hooks/use-toast";

// interface CustomersTableProps {
//   customers: Customer[];
//   isPending: boolean;
// }

type SortBy = "name" | "email" | "subject" | "status" | "date";
type SortOrder = "asc" | "desc";
type StatusFilter = "all" | "read" | "unread" | "responded";

export const CustomersTable = ({ customers: initialCustomers, isPending }) => {
  const { isUpdating, updateStatus } = useUpdateStatus();
  const [customers, setCustomers] = useState([]);
  console.log(customers);

  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortBy, setSortBy] = useState<SortBy>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(
    function () {
      if (isPending) return;
      setCustomers(initialCustomers);
    },
    [initialCustomers, isPending]
  );

  const getStatusColor = (status: Customer["status"]) => {
    switch (status) {
      case "unread":
        return "bg-red-100 text-red-800";
      case "read":
        return "bg-yellow-100 text-yellow-800";
      case "responded":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const sortCustomers = (
    customers: Customer[],
    sortBy: SortBy,
    sortOrder: SortOrder
  ) => {
    return [...customers]?.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case "name":
          aValue = a.fullName.toLowerCase();
          bValue = b.fullName.toLowerCase();
          break;
        case "email":
          aValue = a.gmail.toLowerCase();
          bValue = b.gmail.toLowerCase();
          break;
        case "subject":
          aValue = a.subject.toLowerCase();
          bValue = b.subject.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "date":
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
  };

  const filteredAndSortedCustomers = sortCustomers(
    customers?.filter((customer) => {
      const matchesSearch =
        customer.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.message.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || customer.status === statusFilter;

      return matchesSearch && matchesStatus;
    }),
    sortBy,
    sortOrder
  );

  const totalPages = Math.ceil(
    filteredAndSortedCustomers.length / itemsPerPage
  );
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredAndSortedCustomers.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDetailsOpen(true);
  };

  const handleStatusUpdate = (
    customerId: string,
    newStatus: Customer["status"]
  ) => {
    updateStatus(
      { id: customerId, value: newStatus },
      {
        onSuccess: () => {
          toast({
            title: "Status Updated",
            description: "The customer's status was successfully updated.",
          });
        },
        onError: (error) => {
          toast({
            title: "Failed to Update Status",
            description: `Something went wrong. Error: ${error.message}`,
            variant: "destructive",
          });
        },
      }
    );
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Customer Inquiries</CardTitle>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search customers, emails, subjects, or messages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Select
                value={statusFilter}
                onValueChange={(value: StatusFilter) => setStatusFilter(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="unread">Unread</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={sortBy}
                onValueChange={(value: SortBy) => setSortBy(value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="subject">Subject</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                className="flex items-center space-x-1"
              >
                <ArrowUpDown className="w-4 h-4" />
                <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.fullName}
                  </TableCell>
                  <TableCell>{customer.gmail}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {customer.subject}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={customer.status}
                      onValueChange={(value: Customer["status"]) =>
                        handleStatusUpdate(customer.id, value)
                      }
                      disabled={isUpdating}
                    >
                      <SelectTrigger className="w-32">
                        <Badge className={getStatusColor(customer.status)}>
                          {customer.status}
                        </Badge>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unread">Unread</SelectItem>
                        <SelectItem value="read">Read</SelectItem>
                        <SelectItem value="responded">Responded</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    {new Date(customer.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(customer)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {paginatedCustomers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No customers found matching your criteria.
              </p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      className={
                        currentPage === 1
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          onClick={() => handlePageChange(page)}
                          isActive={currentPage === page}
                          className="cursor-pointer"
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(Math.min(totalPages, currentPage + 1))
                      }
                      className={
                        currentPage === totalPages
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Customer Inquiry Details</DialogTitle>
          </DialogHeader>

          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Name</h4>
                  <p className="text-lg">{selectedCustomer.fullName}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-gray-600">Email</h4>
                  <p className="text-lg">{selectedCustomer.gmail}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-600">Subject</h4>
                <p className="text-lg">{selectedCustomer.subject}</p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-600">Status</h4>
                <Badge className={getStatusColor(selectedCustomer.status)}>
                  {selectedCustomer.status}
                </Badge>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-600">Date</h4>
                <p className="text-lg">
                  {new Date(selectedCustomer.created_at).toLocaleDateString()}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-sm text-gray-600">Message</h4>
                <div className="bg-gray-50 p-4 rounded-lg mt-2">
                  <p className="text-gray-800">{selectedCustomer.message}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
