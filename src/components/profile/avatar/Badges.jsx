import React, { useEffect, useState } from 'react'
import { Progress, Tooltip } from 'flowbite-react';

import { getUserBadges, getUserBadgeInfo } from '../../../api/users.api';
import ExplorerBadge from '../../badges/ExplorerBadge';
import CollaboratorBadge from '../../badges/CollaboratorBadge';
import PopularBadge from '../../badges/PopularBadge';
import VeteranBadge from '../../badges/VeteranBadge';
import StorytellerBadge from '../../badges/StorytellerBadge';


const badgeTypeToComponentMap = {
  VETERAN: VeteranBadge,
  STORYTELLER: StorytellerBadge,
  POPULAR: PopularBadge,
  COLLABORATOR: CollaboratorBadge,
  EXPLORER: ExplorerBadge,
};

const levelOrder = { BRONZE: 1, SILVER: 2, GOLD: 3, OBSIDIAN: 4, MIXELO: 5 };

const LEVEL_COLORS = {
  BRONZE: ["#A97142", "#F0DEA4"],
  SILVER: ["#A7A7A7", "#DCDCDC"],
  GOLD: ["#BC9313", "#E4D4A1"],
  OBSIDIAN: ["#3E2856", "#B2A9BB"],
  MIXELO: ["#3DB1FF", "#B8E3FF"],
};

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function Badges() {
  const [userBadges, setUserBadges] = useState([]);
  const [nextBadgeLevels, setNextBadgeLevels] = useState(null);
  const [error, setError] = useState(null);


  useEffect(() => {
    loadUserBadges();
  }, []);

  async function loadUserBadges() {
    try {
      const profileRes = await getUserBadgeInfo();
      const profileData = profileRes.data;
      console.log("data", profileData);
      setNextBadgeLevels(profileData.next_badge_levels);

      const badgesRes = await getUserBadges(profileData.id);
      const sortedBadges = badgesRes.data.sort((a, b) => {
        if (a.badge_type !== b.badge_type) {
          return Object.keys(badgeTypeToComponentMap).indexOf(a.badge_type) -
            Object.keys(badgeTypeToComponentMap).indexOf(b.badge_type);
        }
        return (levelOrder[a.level] || 0) - (levelOrder[b.level] || 0);
      });
      setUserBadges(sortedBadges);
    } catch (error) {
      setError(error);
    }
  }
  if (!userBadges || !nextBadgeLevels) {
    return <div>Loading badges...</div>;
  }
  return (
    <div className='bg-white rounded border p-3 shadow-lg'>
      <div className='font-semibold text-lg pb-3 md:pb-4'>My rewards</div>
      {['POPULAR', 'COLLABORATOR', 'STORYTELLER', 'EXPLORER', 'VETERAN'].map((badgeType) => {
        const nextLevelInfo = nextBadgeLevels[badgeType] || { next_level: null, percentage: 100 };
        const nextLevel = nextLevelInfo.next_level;
        const progress = nextLevelInfo.percentage;
        const nextBadgeColors = LEVEL_COLORS[nextLevel.toUpperCase()] || ["#AAAAAA", "#DDDDDD"];
        const BadgeComponent = badgeTypeToComponentMap[badgeType];

        return (
          <div key={badgeType} className='bg-gray-50 p-3 rounded mb-3'>
            <div className='flex pb-2 items-center justify-between'>
              <div>
                <div className='font-semibold text-lg border-gray-100'>{capitalize(badgeType.toLowerCase())} badges</div>
                {nextLevel && (
                  <div className='text-sm text-gray-500'>You're about to earn a new badge
                    <span className='font-bold ps-1'>{capitalize(nextLevel)}</span>
                  </div>
                )}
              </div>
              {nextLevel && (
                <div>
                  <Tooltip className="text-sm" content="Next level">
                    {BadgeComponent && <BadgeComponent firstColor={nextBadgeColors[0]} secondColor={nextBadgeColors[1]}
                      className="h-8 w-8 md:h-10 md:w-10" />}
                  </Tooltip>
                </div>
              )}
            </div>
            <div className='w-full bg-gray-200 rounded-lg h-6 mb-2'>
              <div className='h-6 rounded-lg'
                style={{ width: `${progress}%`, backgroundColor: nextBadgeColors[0] }}></div>
            </div>
            <div className='flex gap-1 pt-1 justify-end border-t-2'>
              {userBadges.filter(badge => badge.badge_type === badgeType).map((badge) => {
                const BadgeComponent = badgeTypeToComponentMap[badge.badge_type];
                if (!BadgeComponent) return null;
                const [firstColor, secondColor] = badge.level_colors || ['#FFFFFF', '#000000'];
                return (
                  <Tooltip key={badge.id} className="text-sm" content={`${badge.level} ${capitalize(badge.badge_type)}`} placement="bottom">
                    <BadgeComponent firstColor={firstColor} secondColor={secondColor} className="h-12 w-12 md:h-14 md:w-14" />
                  </Tooltip>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  )
}
