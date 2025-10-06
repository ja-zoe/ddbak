export default function SkeletonProductDetail() {
  return (
    <div className="absolute w-full h-full md:flex justify-center items-center gap-2 p-4 animate-pulse">
      <div className="md:w-1/2 space-y-1">
        <div className="w-full h-80 md:h-[500px] bg-gray-200 rounded relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-shimmer" />
        </div>
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-24 h-24 bg-gray-200 rounded relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
      <div className="p-3 space-y-4 md:w-1/2">
        <div className="space-y-2">
          <div className="w-3/4 h-8 bg-gray-200 rounded" />
          <div className="w-1/3 h-8 bg-gray-200 rounded" />
          <div className="w-full h-4 bg-gray-200 rounded" />
          <div className="w-5/6 h-4 bg-gray-200 rounded" />
        </div>
        <div className="space-y-3">
          <div className="w-full h-10 bg-gray-200 rounded" />
          <div className="w-full h-10 bg-gray-200 rounded" />
          <div className="w-full h-10 bg-gray-200 rounded" />
        </div>
      </div>
    </div>
  );
}
