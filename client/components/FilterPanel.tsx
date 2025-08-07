import { useState } from "react";
import { CalendarDays, X } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";

interface FilterPanelProps {
  onClose: () => void;
}

// Sample data - in a real app this would come from an API
const categoryOptions = [
  "All Categories",
  "Italian Restaurant",
  "Casual Dining",
  "Family Restaurant",
  "Chain Restaurant",
  "Fine Dining",
  "Fast Casual",
];

const subcategoryOptions = [
  "All Subcategories",
  "Traditional Italian",
  "Modern Italian",
  "Pizza & Pasta",
  "Wine & Dine",
  "Family Style",
  "Corporate Dining",
];

const attributeOptions = [
  "Pet Friendly",
  "Outdoor Seating",
  "Delivery Available",
  "Reservations",
  "Happy Hour",
  "Private Dining",
  "Vegetarian Options",
  "Gluten Free",
  "Live Music",
];

interface FilterState {
  dateRange: { from: Date | undefined; to: Date | undefined };
  category: string;
  subcategory: string;
  attributes: string[];
}

export function FilterPanel({ onClose }: FilterPanelProps) {
  console.log("FilterPanel rendering");

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      {/* Filter Panel */}
      <Card className="absolute top-full right-0 mt-2 w-96 shadow-lg border z-50 bg-white">
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-6 w-6 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Simple test content */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Test Filter Panel</label>
            <p className="text-sm text-gray-600">Filter panel is working!</p>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between pt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-sm"
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
