import { useFilters } from "../contexts/FilterContext";

export function DebugFilter() {
  const { filters } = useFilters();
  
  return (
    <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
      <h3 className="font-bold">Debug Filter Context:</h3>
      <pre className="text-xs mt-2">
        {JSON.stringify(filters, null, 2)}
      </pre>
    </div>
  );
}
