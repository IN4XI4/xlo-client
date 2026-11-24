const BADGE_COUNT = 5;

export function ProfileBadgesSkeleton({ withProgress }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-[18px] 2xl:px-6 animate-pulse">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-3.5">
        <div className="flex flex-col gap-1.5">
          <div className="h-4 w-20 rounded-full bg-gray-200" />
          <div className="h-3 w-56 rounded-full bg-gray-200" />
        </div>
        <div className="h-3 w-48 rounded-full bg-gray-200" />
      </div>
      <div className="flex gap-2 overflow-hidden md:grid md:grid-cols-5 md:gap-3 2xl:gap-5">
        {Array.from({ length: BADGE_COUNT }).map((_, i) => (
          <div key={i} className="w-32 flex-shrink-0 md:w-auto bg-[#EEF3F8] rounded-xl p-3 flex flex-col items-center gap-2">
            <div className="h-14 w-14 lg:h-[72px] lg:w-[72px] rounded-full bg-gray-200" />
            <div className="h-3.5 w-20 rounded-full bg-gray-200" />
            <div className="h-3 w-12 rounded-full bg-gray-200" />
            <div className="h-1.5 w-24 rounded-full bg-gray-200" />
            {withProgress && <div className="h-[5px] w-full mt-1 rounded-full bg-gray-200" />}
          </div>
        ))}
      </div>
    </div>
  );
}
