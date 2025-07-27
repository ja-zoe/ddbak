"use client";

export default function ProductErrorBoundary({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="card bg-error text-error-content">
      <h3>Something went wrong</h3>
      <p>{error.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  );
}
