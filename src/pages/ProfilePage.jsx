import React, { useEffect, useState } from 'react'
import { EditProfile } from '../components/profile/EditProfile'
import { PasswordInfo } from '../components/profile/PasswordInfo'
import { Alerts } from '../components/profile/Alerts'
import { getUserProfile } from '../api/users.api';


export function ProfilePage() {
  const [profileInfo, setProfileInfo] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProfileInfo();
  }, []);

  async function loadProfileInfo() {
    try {
      const res = await getUserProfile();
      setProfileInfo(res.data);
    } catch (error) {
      setError(error);
    }
  }
  return (
    <div className="pt-20 md:pt-28 px-4 md:px-16 lg:px-32 xl:px-44">
      <div className='font-bold text-3xl pb-5'>PROFIL & PARAMÈTRES</div>
      {profileInfo && <EditProfile profileInfo={profileInfo} />}
      <PasswordInfo />
      <Alerts />
    </div>
  )
}
