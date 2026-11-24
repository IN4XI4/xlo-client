export function ProfileHeaderSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 lg:p-7 animate-pulse">
      <div className="flex flex-col md:flex-row gap-5 md:gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="h-14 w-14 sm:h-[72px] sm:w-[72px] flex-shrink-0 rounded-full bg-gray-200" />
            <div className="flex-1 flex flex-col gap-2">
              <div className="h-5 w-48 max-w-full rounded-full bg-gray-200" />
              <div className="h-3 w-36 max-w-full rounded-full bg-gray-200" />
            </div>
          </div>
          <div className="mt-4 h-3 w-56 max-w-full rounded-full bg-gray-200" />
          <div className="mt-4 flex gap-6">
            <div className="h-4 w-20 rounded-full bg-gray-200" />
            <div className="h-4 w-20 rounded-full bg-gray-200" />
            <div className="h-4 w-20 rounded-full bg-gray-200" />
          </div>
        </div>
        <div className="w-full md:w-[300px] lg:w-[340px] md:pt-12">
          <div className="h-[86px] rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}
