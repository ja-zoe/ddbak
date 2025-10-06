export default function SkeletonCategoryCard() {
  return (
    <div className="max-w-xs w-full animate-pulse">
      <div className="h-96 bg-gray-200 shadow-xl mx-auto flex flex-col justify-end p-4 relative overflow-hidden rounded">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-shimmer" />
        <div className="relative z-10 space-y-3">
          <div className="w-3/4 h-6 bg-gray-300 rounded" />
          <div className="w-full h-4 bg-gray-300 rounded" />
          <div className="w-5/6 h-4 bg-gray-300 rounded" />
        </div>
      </div>
    </div>
  );
}
