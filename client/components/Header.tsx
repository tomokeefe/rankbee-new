import { useState } from "react";
import { useFilters } from "../contexts/FilterContext";
import { Link } from "react-router-dom";
import { ChevronDown, Headphones, Filter, Mail, User, Settings, LogOut, HelpCircle, MessageCircle, Phone, MapPin } from "lucide-react";
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

// Available brands
const brands = [
  { value: "olive-garden", label: "Olive Garden" },
  { value: "maggianos", label: "Maggiano's" },
  { value: "darden", label: "Darden" },
  { value: "osteria", label: "Osteria M." },
  { value: "bloomin", label: "Bloomin' Brands" },
  { value: "carrabba", label: "Carrabba's" },
];

export function Header() {
  const { filters, updateFilter } = useFilters();
  const [showFilters, setShowFilters] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    subject: "",
    message: "",
    priority: "medium"
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

  const selectedBrand = brands.find((brand) => brand.value === filters.brand);
  const displayName = selectedBrand?.label || "Olive Garden";

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
              className="w-[79px] h-[61px]"
            />

            {/* Divider */}
            <div className="w-px h-[62px] bg-black opacity-20" />

            {/* Company Name */}
            <div className="w-[132px] h-[38px]">
              <span className="text-black font-bold text-[22px] leading-[38px] font-sans">
                GrowCreate
              </span>
            </div>
          </div>

          {/* Center - Brand Selector */}
          <div className="flex-1 flex justify-center">
            <div className="flex items-center gap-[13px]">
              <span className="text-[#18181B] font-bold text-[17px] leading-5 opacity-60 font-sans">
                Brand:
              </span>

              {/* Brand Dropdown */}
              <Select value={filters.brand} onValueChange={handleBrandChange}>
                <SelectTrigger className="w-[311px] h-[51px] px-[33px] border border-[#C9C9C9] rounded-full bg-white text-[#384255] font-bold text-[23px] leading-5 justify-center relative [&>svg]:hidden hover:border-[#9369F6] hover:shadow-md transition-all duration-200 focus:border-[#9369F6] focus:ring-2 focus:ring-[#9369F6]/20 data-[state=open]:border-[#9369F6] data-[state=open]:ring-2 data-[state=open]:ring-[#9369F6]/20">
                  <SelectValue placeholder="Select Brand" className="text-[#384255] font-bold text-[23px]">
                    {displayName}
                  </SelectValue>
                  <svg className="absolute right-[33px] h-4 w-4 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" width="10" height="6" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path opacity="0.6" d="M5.05078 5.51282L0 0.487305H10.1016L5.05078 5.51282Z" fill="black"/>
                  </svg>
                </SelectTrigger>
                <SelectContent className="min-w-[311px]">
                  {brands.map((brand) => {
                    const isSelected = filters.brand === brand.value;
                    return (
                      <SelectItem
                        key={brand.value}
                        value={brand.value}
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
                  size="icon"
                  className="w-8 h-8 p-2 rounded-full hover:bg-gray-100"
                  onClick={() => {
                    console.log("Filter button clicked, showFilters:", showFilters);
                    setShowFilters(!showFilters);
                  }}
                >
                  <Filter className="w-6 h-6 text-[#71717A]" strokeWidth={1.33} />
                </Button>

                {/* Filter Panel */}
                {showFilters && (
                  <FilterPanel onClose={() => setShowFilters(false)} />
                )}
              </div>
            </div>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-[10px] flex-shrink-0">
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
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-[#9369F6]" />
                    Support Center
                  </DialogTitle>
                  <DialogDescription>
                    Find answers to common questions or get help with your account.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="cursor-pointer hover:border-[#9369F6] transition-colors">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <HelpCircle className="h-4 w-4 text-[#9369F6]" />
                          FAQ
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600">Browse frequently asked questions and common solutions.</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-pointer hover:border-[#9369F6] transition-colors">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <MessageCircle className="h-4 w-4 text-[#9369F6]" />
                          Live Chat
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600">Chat with our support team in real-time.</p>
                        <p className="text-xs text-green-600 mt-1">• Available now</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-pointer hover:border-[#9369F6] transition-colors">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Phone className="h-4 w-4 text-[#9369F6]" />
                          Phone Support
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600">Call us at (555) 123-4567</p>
                        <p className="text-xs text-gray-500 mt-1">Mon-Fri 9AM-6PM EST</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="cursor-pointer hover:border-[#9369F6] transition-colors">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center gap-2">
                          <Mail className="h-4 w-4 text-[#9369F6]" />
                          Email Support
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-gray-600">Send us an email at support@growcreate.com</p>
                        <p className="text-xs text-gray-500 mt-1">Response within 24 hours</p>
                      </CardContent>
                    </Card>
                  </div>
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
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}
