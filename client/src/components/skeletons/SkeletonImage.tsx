export default function SkeletonImage({ className }: { className?: string }) {
  return (
    <div className={`${className} bg-gray-200 animate-pulse relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent animate-shimmer" />
    </div>
  );
}
