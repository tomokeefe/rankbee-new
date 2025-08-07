import { useState } from "react";
import { Search, ChevronDown, Headphones, Plus, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface Account {
  id: string;
  name: string;
  initials: string;
  type: "personal" | "business";
}

const accounts: Account[] = [
  { id: "1", name: "GrowCreate", initials: "Gc", type: "business" },
  { id: "2", name: "TechStart Inc", initials: "TS", type: "business" },
  { id: "3", name: "Design Studio", initials: "DS", type: "business" },
  { id: "4", name: "Personal Account", initials: "PA", type: "personal" },
];

export function Header() {
  const [selectedAccount, setSelectedAccount] = useState<Account>(accounts[0]);

  const handleAccountChange = (account: Account) => {
    setSelectedAccount(account);
  };

  const handleCreateAccount = () => {
    // In a real app, this would open a modal or navigate to a create account page
    console.log("Create new account");
  };

  return (
    <header className="bg-white border-b border-gray-200 h-20">
      <div className="flex h-full items-center px-4 lg:px-6 relative">
        {/* Logo */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/3c2b6f10ebb36a0892d78be49e87b8a3f7b89f0d?width=112"
            alt="RankBee Logo"
            className="w-14 h-14"
          />

          {/* Divider */}
          <div className="w-px h-12 bg-gray-300"></div>

          {/* Account Selector Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 hover:bg-gray-100 rounded-lg p-2 transition-colors">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-50 rounded">
                  <span className="text-purple-600 font-bold text-xl font-sans">
                    {selectedAccount.initials}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-black font-bold text-xl font-sans">
                    {selectedAccount.name}
                  </span>
                  <ChevronDown className="w-3 h-3 text-black opacity-60" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              <DropdownMenuLabel className="text-sm text-gray-600">
                Switch Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {accounts.map((account) => (
                <DropdownMenuItem
                  key={account.id}
                  onClick={() => handleAccountChange(account)}
                  className={cn(
                    "flex items-center gap-3 p-3 cursor-pointer",
                    "hover:bg-gray-100 focus:bg-gray-100",
                    selectedAccount.id === account.id
                      ? "bg-purple-100 border-l-4 border-purple-600"
                      : "hover:bg-gray-100",
                  )}
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-50 rounded text-sm">
                    <span className="text-purple-600 font-semibold">
                      {account.initials}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                      {account.name}
                    </span>
                    <span className="text-xs text-gray-500 capitalize">
                      {account.type} account
                    </span>
                  </div>
                  {selectedAccount.id === account.id && (
                    <div className="ml-auto w-2 h-2 bg-purple-600 rounded-full"></div>
                  )}
                </DropdownMenuItem>
              ))}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleCreateAccount}
                className="flex items-center gap-3 p-3 cursor-pointer text-purple-600 hover:bg-gray-100 focus:bg-gray-100"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-purple-50 rounded">
                  <Plus className="w-4 h-4 text-purple-600" />
                </div>
                <span className="font-medium">Create new account</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Centered Search */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search..."
              className="pl-9 h-10 border-gray-300 bg-white focus-visible:ring-1 focus-visible:ring-blue-500 focus-visible:border-blue-500"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-2 flex-shrink-0">
          {/* Support Button */}
          <Button
            variant="ghost"
            className="h-10 px-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            <Headphones className="w-4 h-4 mr-2" />
            Support
          </Button>

          {/* Contact Us Button */}
          <Button
            variant="ghost"
            className="h-10 px-4 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
          >
            Contact Us
          </Button>

          {/* Avatar */}
          <Avatar className="w-10 h-10">
            <AvatarImage
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
              alt="Profile"
            />
            <AvatarFallback className="bg-purple-600 text-white text-sm font-medium">
              {selectedAccount.initials}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
