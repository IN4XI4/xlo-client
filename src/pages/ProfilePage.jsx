import React, { useEffect, useState } from 'react'
import { Tooltip } from 'flowbite-react';

import { EditProfile } from '../components/profile/EditProfile'
import { PasswordInfo } from '../components/profile/PasswordInfo'
import { Alerts } from '../components/profile/Alerts'
import ExplorerBadge from '../components/badges/ExplorerBadge'
import CollaboratorBadge from '../components/badges/CollaboratorBadge'
import PopularBadge from '../components/badges/PopularBadge'
import VeteranBadge from '../components/badges/VeteranBadge'
import StorytellerBadge from '../components/badges/StorytellerBadge'
import { getUserProfile, getUserBadges } from '../api/users.api';


const badgeTypeToComponentMap = {
  VETERAN: VeteranBadge,
  STORYTELLER: StorytellerBadge,
  POPULAR: PopularBadge,
  COLLABORATOR: CollaboratorBadge,
  EXPLORER: ExplorerBadge,
};

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}


export function ProfilePage() {
  const [profileInfo, setProfileInfo] = useState([]);
  const [userBadges, setUserBadges] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  async function loadProfileData() {
    try {
      const profileRes = await getUserProfile();
      const profileData = profileRes.data;
      setProfileInfo(profileData);
      const badgesRes = await getUserBadges(profileData.id);
      setUserBadges(badgesRes.data);
    } catch (error) {
      setError(error);
    }
  }

  return (
    <div className="pt-20 md:pt-28 px-4 md:px-16 lg:px-32 xl:px-44">
      <div className="flex items-center pb-5 justify-between">
        <div className='font-bold text-2xl md:text-3xl'>PROFILE AND PARAMETERS</div>
        <div className="flex flex-wrap items-center justify-end">
          {userBadges.map((badge) => {
            const BadgeComponent = badgeTypeToComponentMap[badge.badge_type];
            if (!BadgeComponent) return null;
            const [firstColor, secondColor] = badge.level_colors || ['#FFFFFF', '#000000'];
            return (
              <div key={badge.id}>
                <Tooltip className="text-sm" content={`${badge.level} ${capitalize(badge.badge_type)}`} placement="bottom">
                  <BadgeComponent
                    firstColor={firstColor}
                    secondColor={secondColor}
                    className="h-10 w-10"
                  />
                </Tooltip>

              </div>
            );
          })}
        </div>
      </div>
      {profileInfo && <EditProfile profileInfo={profileInfo} />}
      <PasswordInfo />
      {profileInfo && (profileInfo.email_info !== undefined) && <Alerts profileInfo={profileInfo} />}
    </div>
  )
}
