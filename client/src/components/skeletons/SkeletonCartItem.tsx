export default function SkeletonCartItem() {
  return (
    <div className="flex gap-4 border-b py-4 animate-pulse">
      <div className="w-28 h-28 bg-gray-200 rounded-sm relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-shimmer" />
      </div>
      <div className="flex grow justify-between">
        <div className="space-y-3 flex-1">
          <div className="space-y-2">
            <div className="w-48 h-6 bg-gray-200 rounded" />
            <div className="w-64 h-4 bg-gray-200 rounded" />
          </div>
          <div className="space-y-1">
            <div className="w-32 h-4 bg-gray-200 rounded" />
            <div className="w-24 h-4 bg-gray-200 rounded" />
          </div>
        </div>
        <div className="flex flex-col justify-between items-end">
          <div className="w-20 h-6 bg-gray-200 rounded" />
          <div className="space-y-2">
            <div className="w-24 h-8 bg-gray-200 rounded" />
            <div className="w-20 h-4 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
