export function MyAssessmentsTileSkeleton({ topicClassName = '' }) {
  return (
    <div className="bg-[#EFEEFE] rounded-xl flex items-center gap-2 mb-1 p-1.5 last:mb-0 animate-pulse">
      <div className="w-12 h-10 flex-shrink-0 rounded-lg bg-[#BFBBFC]/60" />
      <div className="min-w-0 flex-1 flex flex-col gap-1.5">
        <div className={`${topicClassName} h-2.5 w-20 rounded-full bg-[#BFBBFC]/60`} />
        <div className="h-3.5 w-3/4 rounded-full bg-[#BFBBFC]/60" />
        <div className="flex gap-1">
          <div className="h-4 w-12 rounded-full bg-[#BFBBFC]/60" />
          <div className="h-4 w-14 rounded-full bg-[#BFBBFC]/60" />
          <div className="h-4 w-10 rounded-full bg-[#BFBBFC]/60" />
        </div>
      </div>
    </div>
  );
}
