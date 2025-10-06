export default function SkeletonCard() {
  return (
    <div className="flex flex-col items-center space-y-3 animate-pulse">
      <div className="w-60 h-60 bg-gray-200 rounded relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-shimmer" />
      </div>
      <div className="w-40 h-4 bg-gray-200 rounded" />
      <div className="w-20 h-4 bg-gray-200 rounded" />
    </div>
  );
}
