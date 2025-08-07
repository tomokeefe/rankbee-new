import { DashboardLayout } from "../components/DashboardLayout";

export default function BrandOverview() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Brand Overview</h1>
          <p className="text-muted-foreground mt-2">
            Deep dive into individual brand performance and market presence.
          </p>
        </div>

        <div className="bg-card rounded-lg border p-8 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🏷️</span>
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Brand Overview Coming Soon
            </h3>
            <p className="text-muted-foreground">
              This section will showcase detailed brand analytics, including
              performance metrics, market share, and competitive positioning.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
