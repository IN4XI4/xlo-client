import { HiOutlineInformationCircle } from 'react-icons/hi2';

import { HoverTooltip } from '../../HoverTooltip';

export function StatCard({ label, info, value, detail, message, children }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-3 sm:p-[18px] flex flex-col gap-1 min-w-0">
      <div className="flex items-center gap-1 text-xs text-gray-500 font-medium tracking-wide">
        <div className="truncate">{label}</div>
        {info && (
          <HoverTooltip content={info} className="flex-shrink-0">
            <HiOutlineInformationCircle className="w-3.5 h-3.5 text-gray-400 cursor-help" />
          </HoverTooltip>
        )}
      </div>
      <div className="text-2xl sm:text-[28px] font-extrabold tracking-tight leading-tight text-gray-900 tabular-nums">{value}</div>
      {detail && <div className="text-xs text-gray-600 tabular-nums">{detail}</div>}
      <div className="mt-1.5 min-h-[36px] flex items-center">
        {message
          ? <div className="text-xs text-gray-400">{message}</div>
          : children}
      </div>
    </div>
  );
}
