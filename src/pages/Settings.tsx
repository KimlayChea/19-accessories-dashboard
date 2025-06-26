
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface ShippingSettings {
  shippingFee: number;
  freeShippingThreshold: number;
}

interface ContactSettings {
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phoneNumber: string;
  emailAddress: string;
}

interface BusinessHours {
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
}

const Settings = () => {
  const { toast } = useToast();
  
  const [shippingSettings, setShippingSettings] = useState<ShippingSettings>({
    shippingFee: 5.99,
    freeShippingThreshold: 50.00
  });

  const [contactSettings, setContactSettings] = useState<ContactSettings>({
    address: "123 Fashion Street",
    city: "Style District",
    state: "NY",
    zipCode: "10001",
    country: "United States",
    phoneNumber: "+1 (555) 123-4567",
    emailAddress: "hello@centralplan.com"
  });

  const [businessHours, setBusinessHours] = useState<BusinessHours>({
    monday: "9:00 AM - 6:00 PM",
    tuesday: "9:00 AM - 6:00 PM",
    wednesday: "9:00 AM - 6:00 PM",
    thursday: "9:00 AM - 6:00 PM",
    friday: "9:00 AM - 6:00 PM",
    saturday: "10:00 AM - 4:00 PM",
    sunday: "Closed"
  });

  const [shippingFormData, setShippingFormData] = useState<ShippingSettings>({
    shippingFee: shippingSettings.shippingFee,
    freeShippingThreshold: shippingSettings.freeShippingThreshold
  });

  const [contactFormData, setContactFormData] = useState<ContactSettings>({
    ...contactSettings
  });

  const [businessHoursFormData, setBusinessHoursFormData] = useState<BusinessHours>({
    ...businessHours
  });

  const handleShippingInputChange = (field: keyof ShippingSettings, value: string) => {
    const numericValue = parseFloat(value) || 0;
    setShippingFormData(prev => ({
      ...prev,
      [field]: numericValue
    }));
  };

  const handleContactInputChange = (field: keyof ContactSettings, value: string) => {
    setContactFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBusinessHoursChange = (day: keyof BusinessHours, value: string) => {
    setBusinessHoursFormData(prev => ({
      ...prev,
      [day]: value
    }));
  };

  const handleSaveShipping = () => {
    setShippingSettings(shippingFormData);
    toast({
      title: "Shipping Settings Updated",
      description: "Shipping settings have been updated successfully.",
    });
  };

  const handleSaveContact = () => {
    setContactSettings(contactFormData);
    toast({
      title: "Contact Information Updated",
      description: "Contact information has been updated successfully.",
    });
  };

  const handleSaveBusinessHours = () => {
    setBusinessHours(businessHoursFormData);
    toast({
      title: "Business Hours Updated",
      description: "Business hours have been updated successfully.",
    });
  };

  const handleResetShipping = () => {
    setShippingFormData({
      shippingFee: shippingSettings.shippingFee,
      freeShippingThreshold: shippingSettings.freeShippingThreshold
    });
  };

  const handleResetContact = () => {
    setContactFormData({ ...contactSettings });
  };

  const handleResetBusinessHours = () => {
    setBusinessHoursFormData({ ...businessHours });
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-slate-50 to-blue-50">
        <AppSidebar />
        <div className="flex-1">
          <DashboardHeader />
          
          <div className="p-6 space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your store configuration</p>
            </div>

            {/* Shipping Configuration */}
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Shipping Configuration</CardTitle>
                <CardDescription>
                  Configure shipping fees and free shipping thresholds for your store
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="shippingFee">Shipping Fee ($)</Label>
                  <Input
                    id="shippingFee"
                    type="number"
                    step="0.01"
                    min="0"
                    value={shippingFormData.shippingFee}
                    onChange={(e) => handleShippingInputChange('shippingFee', e.target.value)}
                    placeholder="Enter shipping fee"
                  />
                  <p className="text-sm text-gray-500">
                    Standard shipping fee applied to orders below the free shipping threshold
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="freeShippingThreshold">Free Shipping Threshold ($)</Label>
                  <Input
                    id="freeShippingThreshold"
                    type="number"
                    step="0.01"
                    min="0"
                    value={shippingFormData.freeShippingThreshold}
                    onChange={(e) => handleShippingInputChange('freeShippingThreshold', e.target.value)}
                    placeholder="Enter free shipping threshold"
                  />
                  <p className="text-sm text-gray-500">
                    Orders above this amount qualify for free shipping
                  </p>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Current Settings Preview</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• Orders under ${shippingFormData.freeShippingThreshold.toFixed(2)}: ${shippingFormData.shippingFee.toFixed(2)} shipping fee</p>
                    <p>• Orders ${shippingFormData.freeShippingThreshold.toFixed(2)} and above: Free shipping</p>
                  </div>
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button onClick={handleSaveShipping} className="flex-1">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleResetShipping}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>
                  Manage your store's contact details and address
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={contactFormData.address}
                    onChange={(e) => handleContactInputChange('address', e.target.value)}
                    placeholder="Enter street address"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      value={contactFormData.city}
                      onChange={(e) => handleContactInputChange('city', e.target.value)}
                      placeholder="Enter city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      value={contactFormData.state}
                      onChange={(e) => handleContactInputChange('state', e.target.value)}
                      placeholder="Enter state"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={contactFormData.zipCode}
                      onChange={(e) => handleContactInputChange('zipCode', e.target.value)}
                      placeholder="Enter ZIP code"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={contactFormData.country}
                      onChange={(e) => handleContactInputChange('country', e.target.value)}
                      placeholder="Enter country"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    value={contactFormData.phoneNumber}
                    onChange={(e) => handleContactInputChange('phoneNumber', e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Email Address</Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    value={contactFormData.emailAddress}
                    onChange={(e) => handleContactInputChange('emailAddress', e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button onClick={handleSaveContact} className="flex-1">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleResetContact}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Business Hours */}
            <Card className="max-w-2xl">
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
                <CardDescription>
                  Set your store's operating hours for each day of the week
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {Object.entries(businessHoursFormData).map(([day, hours]) => (
                  <div key={day} className="space-y-2">
                    <Label htmlFor={day} className="capitalize">{day}</Label>
                    <Input
                      id={day}
                      value={hours}
                      onChange={(e) => handleBusinessHoursChange(day as keyof BusinessHours, e.target.value)}
                      placeholder="e.g., 9:00 AM - 6:00 PM or Closed"
                    />
                  </div>
                ))}

                <div className="flex space-x-3 pt-4">
                  <Button onClick={handleSaveBusinessHours} className="flex-1">
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleResetBusinessHours}>
                    Reset
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Settings;
