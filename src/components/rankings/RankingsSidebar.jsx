import { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaChevronDown, FaSpinner } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { SIDEBAR_VIEWS } from './sidebarViews';

export function RankingsSidebar({ activeView, setActiveView, topUserId, rankingLoading }) {
  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const navigate = useNavigate();

  const { label, Content } = SIDEBAR_VIEWS[activeView];

  useEffect(() => {
    if (open) setHasOpened(true);
  }, [open]);

  const prevActiveView = useRef(activeView);

  useEffect(() => {
    if (prevActiveView.current === activeView) return;
    prevActiveView.current = activeView;
    setOpen(true);
    setHasOpened(true);
  }, [activeView]);

  return (
    <div className="pt-6 md:pt-0">
      <div
        className="flex items-center gap-3 mb-2 cursor-pointer px-1"
        onClick={() => navigate('/assessments/')}
      >
        <div className="bg-gray-200 rounded-full p-2 flex-shrink-0">
          <FaArrowLeft className="text-gray-600" />
        </div>
        <div className="font-semibold text-gray-700">Back to Mixelo Assessment</div>
      </div>
      <div
        className={`flex items-center bg-white px-5 py-3 select-none transition-[border-radius] duration-300 ${open ? 'rounded-t-3xl' : 'rounded-full'}`}
      >
        <div className="font-semibold text-gray-700 flex-1 cursor-pointer" onClick={() => setOpen(o => !o)}>
          {label}
        </div>
        <div className="bg-gray-200 rounded-full p-2 flex-shrink-0 cursor-pointer" onClick={() => setOpen(o => !o)}>
          <FaChevronDown className={`text-gray-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white rounded-b-xl px-4">
          {hasOpened && (
            rankingLoading
              ? <div className="flex justify-center py-6"><FaSpinner className="text-[#3DB1FF] text-3xl animate-spin" /></div>
              : topUserId === null
                ? <div className="py-6 text-center text-sm text-gray-400">No user to display.</div>
                : <Content userId={topUserId} />
          )}
        </div>
      </div>
    </div>
  );
}
