import React, { useEffect, useState } from 'react'
import { Tooltip } from 'flowbite-react';

import { EditProfile } from '../components/profile/EditProfile'
import { PasswordInfo } from '../components/profile/PasswordInfo'
import { Alerts } from '../components/profile/Alerts'
import { getUserProfile } from '../api/users.api';


export function ProfilePage() {
  const [profileInfo, setProfileInfo] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfileData();
  }, []);

  async function loadProfileData() {
    try {
      const profileRes = await getUserProfile();
      const profileData = profileRes.data;
      setProfileInfo(profileData);
    } catch (error) {
      setError(error);
    }
  }

  return (
    <div className="pt-20 md:pt-28 px-4 md:px-12 lg:px-24 xl:px-28 3xl:px-32">
      <div className="flex items-center pb-5 justify-between">
        <div className='font-bold text-2xl md:text-3xl'>PROFILE AND PARAMETERS</div>
      </div>
      {profileInfo.user_level_display && <EditProfile profileInfo={profileInfo} />}
      <PasswordInfo />
      {profileInfo && (profileInfo.email_info !== undefined) && <Alerts profileInfo={profileInfo} />}
    </div>
  )
}
