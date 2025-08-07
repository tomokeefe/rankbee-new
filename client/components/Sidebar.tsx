import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Grid3X3,
  Tag,
  Search,
  Link2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

const navigationItems = [
  { icon: Home, label: "Visibility", href: "/", active: true },
  { icon: Grid3X3, label: "Category Overview", href: "/categories" },
  { icon: Tag, label: "Brand Overview", href: "/brands" },
  { icon: Search, label: "Prompt Deep Dive", href: "/prompts" },
  { icon: Link2, label: "Citation Analysis", href: "/citations" },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (href: string) => {
    navigate(href);
  };

  return (
    <aside
      className={cn(
        "border-r border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex h-full flex-col">
        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-2 py-4">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Button
                key={item.href}
                variant="ghost"
                onClick={() => handleNavigation(item.href)}
                className={cn(
                  "w-full justify-start gap-3 h-11 transition-all duration-200",
                  collapsed && "px-2",
                  isActive
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "hover:bg-gray-100 hover:text-gray-900 text-muted-foreground",
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </Button>
            );
          })}
        </nav>

        {/* Toggle Button at Bottom */}
        <div className="flex h-14 items-center justify-center px-4 border-t border-border">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="h-8 w-8 hover:bg-gray-100 hover:text-gray-900 transition-colors"
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
}
