import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import { getUserBadgeInfo } from '../../api/users.api';
import { badgeTypeToComponentMap, LEVEL_COLORS } from '../../globals';

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

const BADGE_TYPES = ['POPULAR', 'STORYTELLER'];

function BadgeRowSkeleton() {
  return (
    <div className='bg-gray-50 py-1 px-2 rounded mb-2 animate-pulse'>
      <div className='h-4 w-28 my-1 rounded-full bg-gray-200' />
      <div className='flex items-center gap-1'>
        <div className='flex-grow h-6 rounded-lg bg-gray-200' />
        <div className='h-8 w-8 md:h-10 md:w-10 rounded-full bg-gray-200' />
      </div>
    </div>
  );
}

export function MyRewardsTile() {
  const [isOpen, setIsOpen] = useState(true);
  const [nextBadgeLevels, setNextBadgeLevels] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getUserBadgeInfo()
      .then(res => { if (!cancelled) setNextBadgeLevels(res.data.next_badge_levels); })
      .catch(err => { if (!cancelled) setError(err); });
    return () => { cancelled = true; };
  }, []);

  const renderBadges = () => {
    if (error) {
      return <div className='text-center text-gray-500 text-sm py-6'>Could not load your rewards</div>;
    }
    if (!nextBadgeLevels) {
      return BADGE_TYPES.map(badgeType => <BadgeRowSkeleton key={badgeType} />);
    }
    return BADGE_TYPES.map((badgeType) => {
      const nextLevelInfo = nextBadgeLevels[badgeType] || { next_level: null, percentage: 100 };
      const nextLevel = nextLevelInfo.next_level;
      const progress = nextLevelInfo.percentage;
      const nextBadgeColors = nextLevel
        ? (LEVEL_COLORS[nextLevel.toUpperCase()] || ["#AAAAAA", "#DDDDDD"])
        : ["#3DB1FF", "#DDDDDD"];
      const BadgeComponent = badgeTypeToComponentMap[badgeType];
      return (
        <div key={badgeType} className='bg-gray-50 py-1 px-2 rounded mb-2'>
          <div className='font-semibold border-gray-100'>
            {capitalize(badgeType.toLowerCase())} badges
          </div>
          <div className='flex items-center'>
            <div className='flex-grow bg-gray-200 rounded-lg h-6'>
              <div className='h-6 rounded-lg'
                style={{ width: `${progress}%`, backgroundColor: nextBadgeColors[0] }}>
              </div>
            </div>
            {nextLevel && (
              <div>
                {BadgeComponent && <BadgeComponent firstColor={nextBadgeColors[0]} secondColor={nextBadgeColors[1]}
                  className="h-8 w-8 md:h-10 md:w-10" />}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  return (
    <div className='h-full flex flex-col'>
      <div className={`bg-[#97F2E9] rounded-xl p-3 ${isOpen ? "flex-grow flex flex-col" : ""}`}>
        <div className='flex items-center' onClick={() => setIsOpen(!isOpen)}>
          <div className='flex-grow pe-1 cursor-pointer'>
            <div className='text-[#009B93] font-bold md:text-xl xl:text-2xl border-b-2 border-[#009B93]'>
              My rewards
            </div>
            <div className='text-end text-[#009B93] text-sm pb-1'>
              [Collect the mixelo badges]
            </div>
          </div>
          <div>
            <div className="text-[#0090BD] text-xl cursor-pointer">
              {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
        </div>
        {isOpen && (
          <div className='flex-grow flex flex-col'>
            <div className="flex-grow" />
            <div className='pt-3'>
              {renderBadges()}
            </div>
            <div className="flex-grow"></div>
            <div className='flex justify-end pt-1'>
              <Link to="/avatar/" className='bg-[#009B93] px-4 py-1 rounded-lg text-white cursor-pointer'>
                SEE MY REWARDS
              </Link>
            </div>

          </div>
        )}
      </div>
    </div>

  )
}
