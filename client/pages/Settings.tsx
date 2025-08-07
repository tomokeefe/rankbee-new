import { useState } from "react";
import { DashboardLayout } from "../components/DashboardLayout";
import { useFilters, Brand } from "../contexts/FilterContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Switch } from "../components/ui/switch";
import { Textarea } from "../components/ui/textarea";
import { Badge } from "../components/ui/badge";
import { 
  Settings as SettingsIcon, 
  Link2, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  Bell,
  Shield,
  User,
  Mail,
  Building
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog";

export default function Settings() {
  const { brands, addBrand, updateBrand, deleteBrand } = useFilters();
  const [activeTab, setActiveTab] = useState<"global" | "connections">("global");
  const [isAddingBrand, setIsAddingBrand] = useState(false);
  const [editingBrand, setEditingBrand] = useState<string | null>(null);
  
  // Global Settings State
  const [globalSettings, setGlobalSettings] = useState({
    companyName: "GrowCreate",
    email: "tom@growcreate.com",
    timezone: "America/New_York",
    language: "English",
    notifications: {
      email: true,
      push: true,
      weekly: true,
      alerts: true
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      marketing: false
    }
  });
  
  // Brand form state
  
  const [newBrand, setNewBrand] = useState({
    name: "",
    url: "",
    category: "",
    description: ""
  });

  const handleGlobalSettingChange = (path: string, value: any) => {
    const keys = path.split('.');
    setGlobalSettings(prev => {
      const updated = { ...prev };
      let current: any = updated;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;
      
      return updated;
    });
  };

  const handleAddBrand = () => {
    if (newBrand.name && newBrand.url && newBrand.category) {
      const brandData = {
        name: newBrand.name,
        url: newBrand.url,
        category: newBrand.category,
        description: newBrand.description,
        status: "active" as const,
        addedDate: new Date().toISOString().split('T')[0]
      };

      addBrand(brandData);
      setNewBrand({ name: "", url: "", category: "", description: "" });
      setIsAddingBrand(false);
    }
  };

  const handleDeleteBrand = (id: string) => {
    deleteBrand(id);
  };

  const handleToggleBrandStatus = (id: string) => {
    const brand = brands.find(b => b.id === id);
    if (brand) {
      updateBrand(id, {
        status: brand.status === "active" ? "inactive" : "active"
      });
    }
  };

  const categories = [
    "Fast Food",
    "Casual Dining", 
    "Fine Dining",
    "Fast Casual",
    "Coffee",
    "Pizza",
    "Steakhouse",
    "Other"
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <SettingsIcon className="h-6 w-6 text-[#9369F6]" />
          <h1 className="text-2xl font-bold text-[#9369F6]">Settings</h1>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("global")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "global"
                ? "bg-white text-[#9369F6] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <SettingsIcon className="h-4 w-4" />
              Global Settings
            </div>
          </button>
          <button
            onClick={() => setActiveTab("connections")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              activeTab === "connections"
                ? "bg-white text-[#9369F6] shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4" />
              Connections
            </div>
          </button>
        </div>

        {/* Global Settings Tab */}
        {activeTab === "global" && (
          <div className="space-y-6">
            {/* Account Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <User className="h-5 w-5 text-[#9369F6]" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Company Name</Label>
                    <Input
                      id="companyName"
                      value={globalSettings.companyName}
                      onChange={(e) => handleGlobalSettingChange("companyName", e.target.value)}
                      className="border-gray-300 focus:border-[#9369F6] focus:ring-[#9369F6]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={globalSettings.email}
                      onChange={(e) => handleGlobalSettingChange("email", e.target.value)}
                      className="border-gray-300 focus:border-[#9369F6] focus:ring-[#9369F6]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select value={globalSettings.timezone} onValueChange={(value) => handleGlobalSettingChange("timezone", value)}>
                      <SelectTrigger className="border-gray-300 focus:border-[#9369F6] focus:ring-[#9369F6]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="America/New_York">Eastern Time (EST)</SelectItem>
                        <SelectItem value="America/Chicago">Central Time (CST)</SelectItem>
                        <SelectItem value="America/Denver">Mountain Time (MST)</SelectItem>
                        <SelectItem value="America/Los_Angeles">Pacific Time (PST)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select value={globalSettings.language} onValueChange={(value) => handleGlobalSettingChange("language", value)}>
                      <SelectTrigger className="border-gray-300 focus:border-[#9369F6] focus:ring-[#9369F6]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bell className="h-5 w-5 text-[#9369F6]" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-notifications">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive updates via email</p>
                    </div>
                    <Switch
                      id="email-notifications"
                      checked={globalSettings.notifications.email}
                      onCheckedChange={(checked) => handleGlobalSettingChange("notifications.email", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="push-notifications">Push Notifications</Label>
                      <p className="text-sm text-gray-500">Browser push notifications</p>
                    </div>
                    <Switch
                      id="push-notifications"
                      checked={globalSettings.notifications.push}
                      onCheckedChange={(checked) => handleGlobalSettingChange("notifications.push", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="weekly-reports">Weekly Reports</Label>
                      <p className="text-sm text-gray-500">Weekly performance summaries</p>
                    </div>
                    <Switch
                      id="weekly-reports"
                      checked={globalSettings.notifications.weekly}
                      onCheckedChange={(checked) => handleGlobalSettingChange("notifications.weekly", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="alerts">Performance Alerts</Label>
                      <p className="text-sm text-gray-500">Alerts for significant changes</p>
                    </div>
                    <Switch
                      id="alerts"
                      checked={globalSettings.notifications.alerts}
                      onCheckedChange={(checked) => handleGlobalSettingChange("notifications.alerts", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Shield className="h-5 w-5 text-[#9369F6]" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="data-sharing">Data Sharing</Label>
                      <p className="text-sm text-gray-500">Allow anonymous data sharing for improvements</p>
                    </div>
                    <Switch
                      id="data-sharing"
                      checked={globalSettings.privacy.dataSharing}
                      onCheckedChange={(checked) => handleGlobalSettingChange("privacy.dataSharing", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="analytics">Analytics</Label>
                      <p className="text-sm text-gray-500">Enable usage analytics</p>
                    </div>
                    <Switch
                      id="analytics"
                      checked={globalSettings.privacy.analytics}
                      onCheckedChange={(checked) => handleGlobalSettingChange("privacy.analytics", checked)}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="marketing">Marketing Communications</Label>
                      <p className="text-sm text-gray-500">Receive marketing emails and offers</p>
                    </div>
                    <Switch
                      id="marketing"
                      checked={globalSettings.privacy.marketing}
                      onCheckedChange={(checked) => handleGlobalSettingChange("privacy.marketing", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button className="bg-[#9369F6] hover:bg-[#7C3AED] text-white">
                <Save className="h-4 w-4 mr-2" />
                Save Global Settings
              </Button>
            </div>
          </div>
        )}

        {/* Connections Tab */}
        {activeTab === "connections" && (
          <div className="space-y-6">
            {/* Add Brand Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Building className="h-5 w-5 text-[#9369F6]" />
                    Brand Connections
                  </CardTitle>
                  <Button
                    onClick={() => setIsAddingBrand(true)}
                    className="bg-[#9369F6] hover:bg-[#7C3AED] text-white"
                    disabled={isAddingBrand}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Brand
                  </Button>
                </div>
              </CardHeader>
              
              {isAddingBrand && (
                <CardContent className="border-t bg-gray-50">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="brand-name">Brand Name</Label>
                        <Input
                          id="brand-name"
                          placeholder="Enter brand name"
                          value={newBrand.name}
                          onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
                          className="border-gray-300 focus:border-[#9369F6] focus:ring-[#9369F6]/20"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="brand-url">URL</Label>
                        <Input
                          id="brand-url"
                          type="url"
                          placeholder="https://example.com"
                          value={newBrand.url}
                          onChange={(e) => setNewBrand({ ...newBrand, url: e.target.value })}
                          className="border-gray-300 focus:border-[#9369F6] focus:ring-[#9369F6]/20"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand-category">Category</Label>
                      <Select value={newBrand.category} onValueChange={(value) => setNewBrand({ ...newBrand, category: value })}>
                        <SelectTrigger className="border-gray-300 focus:border-[#9369F6] focus:ring-[#9369F6]/20">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="brand-description">Description (Optional)</Label>
                      <Textarea
                        id="brand-description"
                        placeholder="Brief description of the brand"
                        value={newBrand.description}
                        onChange={(e) => setNewBrand({ ...newBrand, description: e.target.value })}
                        className="border-gray-300 focus:border-[#9369F6] focus:ring-[#9369F6]/20"
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={handleAddBrand}
                        className="bg-[#9369F6] hover:bg-[#7C3AED] text-white"
                        disabled={!newBrand.name || !newBrand.url || !newBrand.category}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Add Brand
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsAddingBrand(false);
                          setNewBrand({ name: "", url: "", category: "", description: "" });
                        }}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Brands List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Connected Brands ({brands.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {brands.map((brand) => (
                    <div
                      key={brand.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-[#9369F6]/30 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-[#384255]">{brand.name}</h3>
                          <Badge
                            variant={brand.status === "active" ? "default" : "secondary"}
                            className={
                              brand.status === "active"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-100"
                            }
                          >
                            {brand.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-blue-600 hover:text-blue-800 mt-1">
                          <a href={brand.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                            {brand.url}
                          </a>
                        </p>
                        <p className="text-sm text-gray-600 mt-1">{brand.category}</p>
                        {brand.description && (
                          <p className="text-sm text-gray-500 mt-1">{brand.description}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          Added on {new Date(brand.addedDate).toLocaleDateString()}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleBrandStatus(brand.id)}
                          className="text-sm"
                        >
                          {brand.status === "active" ? "Deactivate" : "Activate"}
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Brand Connection</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{brand.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteBrand(brand.id)}
                                className="bg-red-600 hover:bg-red-700 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                  
                  {brands.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Building className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No brands connected yet.</p>
                      <p className="text-sm">Add your first brand to get started.</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
