import { useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Brand Overview", href: "/" },
  { name: "Visibility", href: "/visibility" },
  { name: "Prompt Deep Dive", href: "/prompts" },
  { name: "Citation Analysis", href: "/citations" },
];

export function TabNavigation() {
  const location = useLocation();

  return (
    <div className="flex justify-center py-6 bg-gray-50">
      <div className="flex h-10 p-1 items-center bg-white rounded-md shadow-sm border border-gray-200">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex px-3 py-1.5 justify-center items-center text-sm font-medium rounded-sm transition-all duration-200",
                "min-w-[140px] text-center",
                isActive
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-gray-900 hover:text-gray-700 hover:bg-gray-50",
              )}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
