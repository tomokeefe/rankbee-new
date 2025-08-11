import { useState } from "react";
import { useFilters } from "../contexts/FilterContext";
import { Link } from "react-router-dom";
import { ChevronDown, Headphones, Filter, Mail, User, Settings, LogOut, HelpCircle, MessageCircle, Phone, MapPin, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FilterPanel } from "./FilterPanel";
import { MobileMenu } from "./MobileMenu";
import { SupportCenter } from "./SupportCenter";

export function Header() {
  const { filters, brands, updateFilter } = useFilters();
  const [showFilters, setShowFilters] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
    priority: "medium"
  });

  // Persistent filter state that survives panel open/close
  const [persistentFilterState, setPersistentFilterState] = useState({
    selectedCategories: [] as string[],
    selectedSubcategories: [] as string[],
    selectedAttributes: [] as string[],
    selectedModel: "",
    activeDropdown: null as string | null,
    dateRange: {
      from: new Date(2025, 7, 1), // Aug 01, 2025
      to: new Date(2025, 8, 2)   // Sep 02, 2025
    }
  });

  const handleBrandChange = (value: string) => {
    updateFilter("brand", value);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the contact form data to your backend
    console.log("Contact form submitted:", contactForm);
    // Reset form
    setContactForm({ subject: "", message: "", priority: "medium" });
    setContactOpen(false);
    // Show success message
    alert("Thank you for your message! We'll get back to you soon.");
  };

  const handleLogout = () => {
    // Here you would typically handle logout logic (clear auth tokens, etc.)
    console.log("Logging out...");
    alert("You have been logged out successfully.");
    // In a real app, you would redirect to login page or clear authentication state
  };

  // Filter to only show active brands for the selector
  const activeBrands = brands.filter(brand => brand.status === "active");
  const selectedBrand = activeBrands.find((brand) => brand.value === filters.brand);
  const displayName = selectedBrand?.label || (activeBrands.length > 0 ? activeBrands[0].label : "No Brands");

  return (
    <>
      <header className="bg-white h-[90px] shadow-md sticky top-0 z-40">
        <div className="flex h-full items-center px-5">
          {/* Left side - Logo and Company */}
          <div className="flex items-center gap-[25px] flex-shrink-0">
            {/* Logo */}
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/1aaf17a846b7f6d27c800bb71697497d6f50202a?width=158"
              alt="RankBee Logo"
              className="w-[79px] h-[61px] sm:w-[60px] sm:h-[45px]"
            />

            {/* Divider - Hidden on mobile */}
            <div className="w-px h-[62px] bg-black opacity-20 hidden sm:block" />

            {/* Company Name - Hidden on small mobile */}
            <div className="w-[132px] h-[38px] hidden sm:block">
              <span className="text-black font-bold text-[22px] sm:text-[18px] leading-[38px] font-sans">
                GrowCreate
              </span>
            </div>
          </div>

          {/* Center - Brand Selector (Hidden on mobile) */}
          <div className="flex-1 justify-center hidden lg:flex">
            <div className="flex items-center gap-[13px]">
              <span className="text-[#18181B] font-bold text-[17px] leading-5 opacity-60 font-sans">
                Brand:
              </span>

              {/* Brand Dropdown */}
              <Select value={filters.brand} onValueChange={handleBrandChange}>
                <SelectTrigger className="w-[311px] xl:w-[311px] lg:w-[250px] h-[51px] px-[33px] lg:px-[20px] border border-[#C9C9C9] rounded-full bg-white text-[#384255] font-bold text-[23px] lg:text-[18px] leading-5 justify-center relative [&>svg]:hidden hover:border-[#9369F6] hover:shadow-md transition-all duration-200 focus:border-[#9369F6] focus:ring-2 focus:ring-[#9369F6]/20 data-[state=open]:border-[#9369F6] data-[state=open]:ring-2 data-[state=open]:ring-[#9369F6]/20">
                  <SelectValue placeholder="Select Brand" className="text-[#384255] font-bold text-[23px] lg:text-[18px]">
                    {displayName}
                  </SelectValue>
                  <svg className="absolute right-[33px] lg:right-[20px] h-4 w-4 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" width="10" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.6" d="M5.05078 5.51282L0 0.487305H10.1016L5.05078 5.51282Z" fill="black"/>
                  </svg>
                </SelectTrigger>
                <SelectContent className="min-w-[311px] lg:min-w-[250px]">
                  {activeBrands.map((brand) => {
                    const isSelected = filters.brand === brand.value;
                    return (
                      <SelectItem
                        key={brand.value}
                        value={brand.value!}
                        className="text-lg py-3 hover:bg-gray-100 focus:bg-purple-100 data-[highlighted]:bg-gray-100 focus:text-gray-900 hover:text-gray-900"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className={`w-3 h-3 rounded-full ${isSelected ? 'bg-purple-600' : 'bg-gray-300'}`} />
                          <span className={isSelected ? 'font-semibold' : ''}>{brand.label}</span>
                          {isSelected && (
                            <div className="ml-auto">
                              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>

              {/* Filter Icon */}
              <div className="relative">
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 h-8 px-2 rounded-full hover:bg-gray-100 border border-[#CAC4D0] bg-[#FEF7FF]"
                  onClick={() => {
                    console.log("Filter button clicked, showFilters:", showFilters);
                    setShowFilters(!showFilters);
                  }}
                >
                  <Filter className="w-[18px] h-[18px] text-[#18181B]" strokeWidth={2} />
                  <span className="text-sm font-medium text-[#49454F]" style={{ fontFamily: 'Roboto, -apple-system, Roboto, Helvetica, sans-serif' }}>
                    Filters
                  </span>
                  <ChevronDown className="w-[18px] h-[18px] text-[#49454F]" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Hamburger Menu - Visible on tablet and mobile */}
          <div className="flex-1 flex justify-end lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(true)}
              className="h-10 w-10 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6 text-gray-700" />
            </Button>
          </div>

          {/* Right side actions (Hidden on mobile) */}
          <div className="items-center gap-[10px] flex-shrink-0 hidden lg:flex">
            {/* Support Button */}
            <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 px-4 text-[#9369F6] hover:text-purple-700 hover:bg-purple-50 gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
                    <g clipPath="url(#clip0_24_623)">
                      <path
                        d="M3.28679 3.2863L6.11346 6.11296M9.88673 6.11296L12.7134 3.2863M9.88673 9.88639L12.7134 12.7131M6.11346 9.88639L3.28679 12.7131M14.6667 7.99967C14.6667 11.6816 11.6819 14.6663 8.00001 14.6663C4.31811 14.6663 1.33334 11.6816 1.33334 7.99967C1.33334 4.31778 4.31811 1.33301 8.00001 1.33301C11.6819 1.33301 14.6667 4.31778 14.6667 7.99967ZM10.6667 7.99967C10.6667 9.47243 9.47277 10.6663 8.00001 10.6663C6.52725 10.6663 5.33334 9.47243 5.33334 7.99967C5.33334 6.52692 6.52725 5.33301 8.00001 5.33301C9.47277 5.33301 10.6667 6.52692 10.6667 7.99967Z"
                        stroke="#9369F6"
                        strokeWidth="1.33"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_24_623">
                        <rect width="16" height="16" fill="white"/>
                      </clipPath>
                    </defs>
                  </svg>
                  <span className="text-sm font-medium">Support</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-[#9369F6]" />
                    Support Center
                  </DialogTitle>
                  <DialogDescription>
                    Find answers to common questions or get help with your account.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <SupportCenter onClose={() => setSupportOpen(false)} />
                </div>
              </DialogContent>
            </Dialog>

            {/* Contact Us Button */}
            <Dialog open={contactOpen} onOpenChange={setContactOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-10 px-4 text-[#9369F6] hover:text-purple-700 hover:bg-purple-50 gap-2"
                >
                  <Mail className="w-4 h-4" strokeWidth={1.33} />
                  <span className="text-sm font-medium">Contact Us</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-[#9369F6]" />
                    Contact Us
                  </DialogTitle>
                  <DialogDescription>
                    Send us a message and we'll get back to you as soon as possible.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      placeholder="What can we help you with?"
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      required
                      className="border-gray-300 focus:border-[#9369F6] focus:ring-[#9369F6]/20"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={contactForm.priority} onValueChange={(value) => setContactForm({ ...contactForm, priority: value })}>
                      <SelectTrigger className="border-gray-300 focus:border-[#9369F6] focus:ring-[#9369F6]/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - General inquiry</SelectItem>
                        <SelectItem value="medium">Medium - Account issue</SelectItem>
                        <SelectItem value="high">High - Urgent support needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please describe your question or issue in detail..."
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      required
                      rows={4}
                      className="border-gray-300 focus:border-[#9369F6] focus:ring-[#9369F6]/20"
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button type="submit" className="bg-[#9369F6] hover:bg-[#7C3AED] text-white flex-1">
                      Send Message
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setContactOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>

            {/* Profile Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
                      alt="Profile"
                    />
                    <AvatarFallback className="bg-purple-600 text-white text-sm font-medium">
                      TO
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">Tom O'Keefe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      tom@growcreate.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={() => setProfileOpen(true)}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" asChild>
                  <Link to="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Profile Dialog */}
            <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-[#9369F6]" />
                    Profile Information
                  </DialogTitle>
                  <DialogDescription>
                    View and manage your account information.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Profile Picture Section */}
                  <div className="flex items-center gap-4">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face"
                        alt="Profile"
                      />
                      <AvatarFallback className="bg-purple-600 text-white text-lg font-bold">
                        TO
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold">Tom O'Keefe</h3>
                      <p className="text-sm text-gray-600">Account Administrator</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Change Photo
                      </Button>
                    </div>
                  </div>

                  {/* Account Information */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Full Name</Label>
                        <p className="text-sm text-gray-900 mt-1">Tom O'Keefe</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Email</Label>
                        <p className="text-sm text-gray-900 mt-1">tom@growcreate.com</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Role</Label>
                        <p className="text-sm text-gray-900 mt-1">Administrator</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Company</Label>
                        <p className="text-sm text-gray-900 mt-1">GrowCreate</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Member Since</Label>
                        <p className="text-sm text-gray-900 mt-1">January 2025</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Last Login</Label>
                        <p className="text-sm text-gray-900 mt-1">Today at 2:30 PM</p>
                      </div>
                    </div>
                  </div>

                  {/* Account Statistics */}
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Account Activity</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-[#9369F6]">3</p>
                        <p className="text-xs text-gray-600">Brands Connected</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-[#9369F6]">147</p>
                        <p className="text-xs text-gray-600">Reports Generated</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-lg font-bold text-[#9369F6]">24</p>
                        <p className="text-xs text-gray-600">Days Active</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setProfileOpen(false)}
                  >
                    Close
                  </Button>
                  <Button
                    className="flex-1 bg-[#9369F6] hover:bg-[#7C3AED] text-white"
                    onClick={() => {
                      setProfileOpen(false);
                      // In a real app, this would navigate to an edit profile page
                      alert("Edit Profile functionality would be implemented here.");
                    }}
                  >
                    Edit Profile
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </header>

      {/* Filter Panel - pushes content down when open */}
      {showFilters && (
        <FilterPanel
          onClose={() => setShowFilters(false)}
          persistentState={persistentFilterState}
          onStateChange={setPersistentFilterState}
        />
      )}

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </>
  );
}
