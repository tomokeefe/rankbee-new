import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  Eye,
  ArrowUp,
  ArrowDown,
  Download,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";

interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  title: string;
  columns: TableColumn[];
  data: any[];
  exportable?: boolean;
}

const brandData = [
  {
    brand: "Olive Garden",
    coverage: 49.0,
    avgRank: 1.2,
    change: 2.1,
    prompts: 131,
  },
  {
    brand: "Maggiano's Little Italy",
    coverage: 15.3,
    avgRank: 2.8,
    change: -0.5,
    prompts: 42,
  },
  {
    brand: "Romano's Macaroni Grill",
    coverage: 8.7,
    avgRank: 3.2,
    change: 1.3,
    prompts: 28,
  },
  {
    brand: "Carrabba's Italian Grill",
    coverage: 6.2,
    avgRank: 3.8,
    change: -1.1,
    prompts: 19,
  },
];

const citationData = [
  {
    domain: "tripadvisor.com",
    citations: 1247,
    coverage: 23.4,
    avgRank: 1.1,
    change: 1.8,
  },
  {
    domain: "yelp.com",
    citations: 892,
    coverage: 18.9,
    change: 0.7,
  },
  {
    domain: "opentable.com",
    citations: 634,
    coverage: 12.3,
    change: -0.3,
  },
  {
    domain: "zomato.com",
    citations: 421,
    coverage: 8.1,
    change: 2.2,
  },
];

function DataTable({
  title,
  columns,
  data,
  exportable = true,
}: DataTableProps) {
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("desc");
    }
  };

  const sortedData = [...data].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn];
    const bValue = b[sortColumn];

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
    }

    return sortDirection === "asc"
      ? String(aValue).localeCompare(String(bValue))
      : String(bValue).localeCompare(String(aValue));
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        {exportable && (
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={cn(
                      "text-left py-3 px-4 text-sm font-medium text-muted-foreground",
                      column.sortable && "cursor-pointer hover:text-foreground",
                    )}
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-2">
                      {column.label}
                      {column.sortable && (
                        <div className="flex flex-col">
                          <ChevronUp
                            className={cn(
                              "h-3 w-3",
                              sortColumn === column.key &&
                                sortDirection === "asc"
                                ? "text-primary"
                                : "text-muted-foreground/50",
                            )}
                          />
                          <ChevronDown
                            className={cn(
                              "h-3 w-3 -mt-1",
                              sortColumn === column.key &&
                                sortDirection === "desc"
                                ? "text-primary"
                                : "text-muted-foreground/50",
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="py-3 px-4 text-sm">
                      {column.render
                        ? column.render(row[column.key], row)
                        : row[column.key]}
                    </td>
                  ))}
                  <td className="py-3 px-4">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export function BrandsTable() {
  const columns: TableColumn[] = [
    {
      key: "brand",
      label: "Brand",
      sortable: true,
      render: (value) => (
        <span className="font-medium text-foreground">{value}</span>
      ),
    },
    {
      key: "coverage",
      label: "Coverage",
      sortable: true,
      render: (value) => <span>{value}%</span>,
    },
    {
      key: "avgRank",
      label: "AVG Rank",
      sortable: true,
      render: (value) => <span>{value}</span>,
    },
    {
      key: "change",
      label: "Change",
      sortable: true,
      render: (value) => (
        <div
          className={cn(
            "flex items-center gap-1",
            value > 0 ? "text-green-600" : "text-red-600",
          )}
        >
          {value > 0 ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )}
          <span>{Math.abs(value)}%</span>
        </div>
      ),
    },
    {
      key: "prompts",
      label: "Prompts",
      sortable: true,
    },
  ];

  return (
    <DataTable
      title="Top Brands Performance"
      columns={columns}
      data={brandData}
    />
  );
}

export function CitationsTable() {
  const columns: TableColumn[] = [
    {
      key: "domain",
      label: "Domain",
      sortable: true,
      render: (value) => (
        <span className="font-medium text-foreground">{value}</span>
      ),
    },
    {
      key: "citations",
      label: "Citations",
      sortable: true,
      render: (value) => (
        <span className="font-mono">{value.toLocaleString()}</span>
      ),
    },
    {
      key: "coverage",
      label: "Coverage",
      sortable: true,
      render: (value) => <span>{value}%</span>,
    },
    {
      key: "change",
      label: "Change",
      sortable: true,
      render: (value) => (
        <div
          className={cn(
            "flex items-center gap-1",
            value > 0 ? "text-green-600" : "text-red-600",
          )}
        >
          {value > 0 ? (
            <ArrowUp className="h-3 w-3" />
          ) : (
            <ArrowDown className="h-3 w-3" />
          )}
          <span>{Math.abs(value)}%</span>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      title="Citation Analysis"
      columns={columns}
      data={citationData}
    />
  );
}
