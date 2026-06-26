import React, { useEffect, useState } from 'react';
import { SelectOption } from '../components/rankings/SelectOption';
import { RankingList } from '../components/rankings/RankingList';
import { RankingsSidebarCol } from '../components/rankings/RankingsSidebarCol';
import { RankingsSidebar } from '../components/rankings/RankingsSidebar';
import { DEFAULT_VIEW } from '../components/rankings/sidebarViews';


export function RankingsPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState("0");
  const [rankingType, setRankingType] = useState("0");
  const [topUserId, setTopUserId] = useState(null);
  const [rankingLoading, setRankingLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [searchName, setSearchName] = useState('');
  const [isLg, setIsLg] = useState(() => window.matchMedia('(min-width: 1024px)').matches);
  const [activeView, setActiveView] = useState(DEFAULT_VIEW);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e) => setIsLg(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setSearchName(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  function handleCategoryChange(id) {
    setSelectedCategoryId(id);
    setTopUserId(null);
    setRankingLoading(true);
  }

  function handleRankingTypeChange(type) {
    setRankingType(type);
    setTopUserId(null);
    setRankingLoading(true);
  }

  function handleSearchChange(value) {
    setSearchInput(value);
    setTopUserId(null);
    setRankingLoading(true);
  }

  function handleUsersLoaded(users) {
    setTopUserId(users[0]?.id ?? null);
    setRankingLoading(false);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-10 gap-2 w-full p-4 pt-16 md:pt-24">
      {isLg
        ? <RankingsSidebarCol activeView={activeView} setActiveView={setActiveView} topUserId={topUserId} rankingLoading={rankingLoading} />
        : <RankingsSidebar activeView={activeView} setActiveView={setActiveView} topUserId={topUserId} rankingLoading={rankingLoading} />}
      <div className="lg:col-span-8 lg:px-2 lg:me-3">
        <div className='pb-3'>
          <div className="text-gray-600 font-bold md:text-xl xl:text-2xl border-b-2 border-gray-600">
            Mixelo user rankings
          </div>
          <div className="text-end text-gray-600 text-sm pb-1">
            [All Mixelo users ranked]
          </div>
        </div>
        <SelectOption
          onCategoryChange={handleCategoryChange}
          onRankingTypeChange={handleRankingTypeChange}
          onSearchChange={handleSearchChange}
        />
        <RankingList
          categoryId={selectedCategoryId}
          rankingType={rankingType}
          search={searchName}
          onUsersLoaded={handleUsersLoaded}
          selectedUserId={topUserId}
          onUserSelect={setTopUserId}
        />
      </div>
    </div>
  );
}
