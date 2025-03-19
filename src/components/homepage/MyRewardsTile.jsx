import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import { getUserBadgeInfo } from '../../api/users.api';
import { badgeTypeToComponentMap, LEVEL_COLORS } from '../../globals';

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function MyRewardsTile() {
  const [isOpen, setIsOpen] = useState(true);
  const [nextBadgeLevels, setNextBadgeLevels] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUserBadges();
  }, []);

  async function loadUserBadges() {
    try {
      const profileRes = await getUserBadgeInfo();
      const profileData = profileRes.data;
      setNextBadgeLevels(profileData.next_badge_levels);
    } catch (error) {
      setError(error);
    }
  }

  if (!nextBadgeLevels) {
    return <div>Loading badges...</div>;
  }
  return (
    <div className='flex flex-col max-h-full'>
      <div className={`bg-[#97F2E9] rounded-xl p-3 sm:ms-2 ${isOpen ? "flex-grow flex flex-col" : ""}`}>
        <div className='flex items-center' onClick={() => setIsOpen(!isOpen)}>
          <div className='flex-grow pe-1 cursor-pointer'>
            <div className='text-[#009B93] font-bold text-xl xl:text-2xl border-b-2 border-[#009B93]'>
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
            <div className='pt-3'>
              {['POPULAR', 'STORYTELLER'].map((badgeType) => {
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
              })}
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
