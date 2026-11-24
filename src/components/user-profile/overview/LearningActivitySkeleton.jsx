const STAT_COUNT = 4;

export function LearningActivitySkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-[18px] animate-pulse">
      <div className="flex flex-col gap-1.5 mb-3.5">
        <div className="h-4 w-32 rounded-full bg-gray-200" />
        <div className="h-3 w-48 rounded-full bg-gray-200" />
      </div>
      <div className="w-full max-w-[756px] aspect-[37/10] min-h-[118px] rounded-lg bg-gray-100" />
      <div className="flex flex-wrap gap-6 mt-4">
        {Array.from({ length: STAT_COUNT }).map((_, i) => (
          <div key={i} className="flex flex-col gap-1.5">
            <div className="h-5 w-14 rounded-full bg-gray-200" />
            <div className="h-3 w-20 rounded-full bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
  );
}
