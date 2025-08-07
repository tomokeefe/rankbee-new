import { DashboardLayout } from "../components/DashboardLayout";

export default function CategoryOverview() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            Category Overview
          </h1>
          <p className="text-muted-foreground mt-2">
            Comprehensive analysis of your brand performance across different
            categories.
          </p>
        </div>

        <div className="bg-card rounded-lg border p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Category Overview Coming Soon
            </h3>
            <p className="text-muted-foreground">
              This section will provide detailed insights into category
              performance, market positioning, and competitive analysis across
              different sectors.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
