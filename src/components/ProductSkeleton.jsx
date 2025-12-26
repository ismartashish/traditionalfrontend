export default function ProductSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow animate-pulse">
      <div className="h-40 bg-gray-300" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-gray-300 rounded w-3/4" />
        <div className="h-4 bg-gray-300 rounded w-1/2" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
    </div>
  );
}
