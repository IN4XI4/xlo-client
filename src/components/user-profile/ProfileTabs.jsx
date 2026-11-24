import { useEffect, useLayoutEffect, useRef, useState } from 'react';

import { formatNumber } from './formatNumber';

export const DEFAULT_TAB = 'overview';

// Height of the fixed navigation bar (p-4 + h-10 content), so the tabs stick right under it.
const NAVBAR_HEIGHT_CLASS = 'top-[72px]';

// Tabs per viewer: guests see overview + stories, logged-in users add people, the owner sees all.
// Counts come from users/{id}/; a field the viewer can't see arrives undefined and the pill is hidden.
function getTabs(profile, isAuthenticated, isOwner) {
  const peopleCount = profile.followers_count != null || profile.following_count != null
    ? (profile.followers_count ?? 0) + (profile.following_count ?? 0)
    : null;
  return [
    { key: 'overview', label: 'Overview', count: null, visible: true },
    { key: 'stories', label: 'Stories', count: profile.stories_count, visible: true },
    { key: 'assessments', label: 'Assessments', count: profile.attempts_count, visible: isOwner },
    { key: 'people', label: 'People', count: peopleCount, visible: isAuthenticated },
    { key: 'spaces', label: 'Spaces', count: profile.spaces_count, visible: isOwner },
  ].filter((tab) => tab.visible);
}

export function ProfileTabs({ profile, isAuthenticated, isOwner, activeTab, onChange }) {
  const scrollRef = useRef(null);
  const tabRefs = useRef({});
  const isFirstRender = useRef(true);
  const [fade, setFade] = useState({ left: false, right: false });

  // Fades at the edges only where tabs are hidden, so on small screens it's clear the row scrolls.
  useLayoutEffect(() => {
    const el = scrollRef.current;
    const update = () => setFade({
      left: el.scrollLeft > 1,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 1,
    });
    update();
    el.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => {
      el.removeEventListener('scroll', update);
      observer.disconnect();
    };
  }, []);

  // Keep the selected tab fully visible when it was partly hidden.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    tabRefs.current[activeTab]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeTab]);

  return (
    <div className={`sticky ${NAVBAR_HEIGHT_CLASS} z-20 mt-4 border-b border-gray-200 bg-gray-50`}>
      <div ref={scrollRef} role="tablist"
        className="flex gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {getTabs(profile, isAuthenticated, isOwner).map((tab) => {
          const isActive = tab.key === activeTab;
          return (
            <button key={tab.key} type="button" role="tab" aria-selected={isActive}
              ref={(node) => { tabRefs.current[tab.key] = node; }}
              onClick={() => onChange(tab.key)}
              className={`flex flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-[10px] px-3.5 py-2 text-sm font-semibold
                ${isActive
                  ? 'bg-white text-gray-900 shadow-[inset_0_-2px_0_#3DB1FF,0_1px_2px_rgba(17,25,40,0.05),0_4px_16px_rgba(17,25,40,0.04)]'
                  : 'text-gray-600 hover:bg-[#EEF3F8] hover:text-gray-900'}`}>
              {tab.label}
              {tab.count != null && (
                <span className={`rounded-full px-[7px] py-px text-[11px] font-semibold tabular-nums
                  ${isActive ? 'bg-[#E3F4FF] text-[#0A74BD]' : 'bg-[#EEF3F8] text-gray-500'}`}>
                  {formatNumber(tab.count)}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className={`pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-gray-50 transition-opacity
        ${fade.left ? 'opacity-100' : 'opacity-0'}`} />
      <div className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-gray-50 transition-opacity
        ${fade.right ? 'opacity-100' : 'opacity-0'}`} />
    </div>
  );
}
