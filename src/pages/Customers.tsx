import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { CustomersTable } from "@/components/CustomersTable";
import { useCustomerMessages } from "@/customs/customerMessage/useCustomerMessages";

export interface Customer {
  id: string;
  fullName: string;
  gmail: string;
  subject: string;
  message: string;
  status: "read" | "unread" | "responded";
  created_at: string;
}

const Customers = () => {
  const { isPending, customerMessages } = useCustomerMessages();
  console.log(customerMessages);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <AppSidebar />
        <div className="flex-1">
          <DashboardHeader />

          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
              <p className="text-gray-600">
                Manage customer inquiries and communications
              </p>
            </div>

            <CustomersTable
              customers={customerMessages}
              isPending={isPending}
            />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Customers;
