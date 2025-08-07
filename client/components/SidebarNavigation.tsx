import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { 
  BarChart3,
  TrendingDown,
  MessageSquare,
  FileText
} from "lucide-react";

const navItems = [
  {
    name: "Snapshot",
    href: "/",
    icon: BarChart3
  },
  {
    name: "Trends",
    href: "/trends",
    icon: TrendingUp
  },
  {
    name: "Gaps",
    href: "/visibility",
    icon: TrendingDown
  },
  {
    name: "Prompts",
    href: "/prompts",
    icon: MessageSquare
  },
  {
    name: "Citations",
    href: "/citations",
    icon: FileText
  },
];

export function SidebarNavigation() {
  const location = useLocation();

  return (
    <aside className="fixed left-0 top-[90px] w-64 bg-white border-r border-gray-200 h-[calc(100vh-90px)] flex-shrink-0 z-30">
      <nav className="p-4">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            const IconComponent = item.icon;

            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group",
                  isActive
                    ? "bg-purple-600 text-white shadow-sm"
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                <IconComponent className={cn(
                  "w-5 h-5 flex-shrink-0",
                  isActive ? "text-white" : "text-gray-500 group-hover:text-gray-700"
                )} />
                <span className="font-medium text-sm">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}
