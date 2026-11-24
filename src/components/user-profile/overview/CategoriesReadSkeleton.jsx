const ROW_COUNT = 5;

export function CategoriesReadSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-[18px] animate-pulse">
      <div className="flex flex-col gap-1.5 mb-3.5">
        <div className="h-4 w-44 rounded-full bg-gray-200" />
        <div className="h-3 w-40 rounded-full bg-gray-200" />
      </div>
      <div className="flex flex-col gap-3">
        {Array.from({ length: ROW_COUNT }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1">
            <div className="h-3 w-28 rounded-full bg-gray-200" />
            <div className="h-2.5 w-full rounded-full bg-gray-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
