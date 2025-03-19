import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi2';

import { TopicsSelect } from '../components/homepage/TopicsSelect';
import { AtGlanceTile } from '../components/homepage/AtGlanceTile';
import { MyActivitiesTile } from '../components/homepage/MyActivitiesTile';
import { MyFavoriteStoriesTile } from '../components/homepage/MyFavoriteStoriesTile';
import { MyRewardsTile } from '../components/homepage/MyRewardsTile';
import { useUser } from '../context/UserContext';
import { MyAvatarTile } from '../components/homepage/MyAvatarTile';
import { MySpacesTile } from '../components/homepage/MySpacesTile';


export function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setShowAlert(!token);
  }, []);

  useEffect(() => {
    if (location.state?.storyDeleted) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        navigate(location.pathname, { replace: true, state: {} });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className="pt-24 md:pt-24 px-4 md:px-12 lg:px-24 xl:px-28 3xl:px-32">
      <div>
        {showAlert && (
          <Alert
            color="info"
            icon={HiInformationCircle}
            className="mb-4"
            onDismiss={() => setShowAlert(false)}
          >
            <span className="font-medium">Sign in to unlock all features and enhance your experience!</span>
          </Alert>
        )}
        {showSuccessMessage && (
          <Alert color="success" icon={HiInformationCircle} className='mb-4'>
            <span className="font-medium">Story deleted successfully!</span>
          </Alert>
        )}
        <div className='flex flex-col md:flex-row items-start'>
          <div className='w-full md:w-[55%] md:pe-1'>
            <TopicsSelect isAuthenticated={isAuthenticated} />
            {user && <div className="py-3"><AtGlanceTile isAuthenticated={isAuthenticated} /></div>}
            {!user && <div className="py-3"><MyActivitiesTile isAuthenticated={isAuthenticated} /></div>}
          </div>
          {user ? <div className='w-full md:w-[45%] grid grid-cols-1 sm:grid-cols-2 md:ps-2'>
            <MyActivitiesTile activeDays={user.active_days} isAuthenticated={isAuthenticated} />
            <MyRewardsTile user={user} />
            <div className="sm:col-span-2 py-3"><MyFavoriteStoriesTile /></div>
            <MyAvatarTile />
            <MySpacesTile />
          </div> :
            <div className='w-full md:w-[45%] grid grid-cols-1 sm:grid-cols-2 md:ps-2'>
              <div className="sm:col-span-2 pt-3 md:pt-0 pb-3"><AtGlanceTile isAuthenticated={isAuthenticated} /></div>
            </div>}
        </div>

      </div>
    </div>
  )
}
