import { useState } from 'react';

import { OverviewTab } from './overview/OverviewTab';

// Each tab mounts on its first visit and then stays mounted (hidden when inactive),
// so switching tabs doesn't refetch or re-render its content.
export function ProfileTabContent({ activeTab, userId, isAuthenticated, isOwner }) {
  const [visited, setVisited] = useState(() => new Set([activeTab]));
  if (!visited.has(activeTab)) {
    setVisited(new Set(visited).add(activeTab));
  }

  const panel = (key, content) => visited.has(key) && (
    <div key={key} className={activeTab === key ? '' : 'hidden'}>{content}</div>
  );

  return (
    <div role="tabpanel" data-tab={activeTab} className="pt-5">
      {panel('overview', <OverviewTab userId={userId} isAuthenticated={isAuthenticated} isOwner={isOwner} />)}
    </div>
  );
}
