import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { TrendingDown, AlertTriangle } from "lucide-react";

export function Summary() {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0"></div>
            <p className="text-foreground">
              Brand ranks <span className="font-semibold">#3 overall</span> in
              whiskey-related queries
            </p>
          </div>

          <div className="flex items-start gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
            <p className="text-foreground">
              Appeared in <span className="font-semibold">64.3 percent</span> of
              answers
            </p>
          </div>

          <div className="flex items-start gap-2">
            <TrendingDown className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-foreground">
              Your visibility{" "}
              <span className="font-medium text-amber-600">
                dropped slightly
              </span>{" "}
              this week - consider boosting in{" "}
              <span className="font-semibold">Bourbon</span> and{" "}
              <span className="font-semibold">single-malt subcategories</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
