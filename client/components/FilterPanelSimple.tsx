import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface FilterPanelProps {
  onClose: () => void;
}

export function FilterPanelSimple({ onClose }: FilterPanelProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/20"
        onClick={onClose}
      />

      {/* Filter Panel */}
      <Card className="absolute top-full right-0 mt-2 w-[480px] shadow-xl border-0 z-50 bg-white rounded-lg overflow-hidden">
        <CardContent className="p-0">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <h3 className="font-bold text-lg text-[#384255]">Filters</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 hover:bg-gray-200 rounded-full"
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          </div>

          <div className="p-4 space-y-6">
            <div className="text-center">
              <p>Filter Panel Loading...</p>
              <p className="text-sm text-gray-500">Testing basic functionality</p>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between gap-3 p-4 border-t bg-gray-50">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 h-9 text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-100"
            >
              Clear All
            </Button>
            <Button
              onClick={onClose}
              className="flex-1 h-9 bg-[#9369F6] hover:bg-[#7C3AED] text-white"
            >
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
