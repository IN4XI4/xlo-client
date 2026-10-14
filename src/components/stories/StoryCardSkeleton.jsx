export function StoryCardSkeleton() {
  return (
    <div className="flex p-2 my-3 min-h-[4.75rem] sm:min-h-[5.5rem] rounded-3xl border bg-gray-100 animate-pulse">
      <div className="w-16 h-14 sm:w-24 sm:h-20 flex-shrink-0 rounded-xl mr-2 self-center bg-gray-300" />
      <div className="w-full overflow-hidden">
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
          <div className="h-4 w-2/3 rounded-full bg-gray-300" />
          <div className="h-3 w-16 rounded-full bg-gray-300 flex-shrink-0" />
        </div>
        <div className="h-3 w-4/5 rounded-full bg-gray-300 mt-2 mb-2" />
        <div className="flex flex-wrap gap-1">
          <div className="h-5 w-20 rounded-full bg-gray-300" />
          <div className="h-5 w-24 rounded-full bg-gray-300" />
          <div className="h-5 w-12 rounded-full bg-gray-300" />
          <div className="h-5 w-10 rounded-full bg-gray-300" />
        </div>
      </div>
      <div className="flex flex-col justify-center gap-1 ps-2 pe-1">
        <div className="w-4 h-4 rounded-full bg-gray-300" />
        <div className="w-4 h-4 rounded-full bg-gray-300" />
      </div>
    </div>
  );
}
