export function StatCardSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-[18px] flex flex-col gap-2 animate-pulse">
      <div className="h-3 w-24 rounded-full bg-gray-200" />
      <div className="h-7 w-28 rounded-lg bg-gray-200" />
      <div className="h-3 w-40 rounded-full bg-gray-200" />
      <div className="h-9 mt-1.5 rounded-lg bg-gray-100" />
    </div>
  );
}
