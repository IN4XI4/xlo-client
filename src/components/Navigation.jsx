import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, Dropdown } from 'flowbite-react';

import { FaBookmark } from 'react-icons/fa';
import { HiBellAlert } from "react-icons/hi2";
import { AiFillFire } from "react-icons/ai";
import { BiSolidBellRing } from "react-icons/bi";
import { PiTextAlignJustifyFill } from "react-icons/pi";
import { IoPlanetSharp } from "react-icons/io5";
import { ImExit } from "react-icons/im";

import { CREATOR_LEVEL_1 } from '../globals';
import { getUser } from '../api/users.api';
import { getActiveSpace } from '../api/spaces.api';
import { useAppState } from '../context/ScrollContext';
import { useSpace } from '../context/SpaceContext';
import { ComingSoonModal } from './modals/ComingSoonModal';
import { NotificationsModal } from './modals/NotificationsModal';
import logo from '../assets/Logo.svg';
import profile_pic from '../assets/Profile-pic.svg';
import { SelectRecallsModal } from './modals/SelectRecallsModal';
import { useUser } from '../context/UserContext';
import { RocketIcon } from './illustrations/icons/RocketIcon';

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUser();
  const [error, setError] = useState(null);
  const { isScrolled, storyTitle, currentCardTitle, setIsScrolled, navigationKey } = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRecallsModalOpen, setIsRecallsModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContext, setModalContext] = useState('');
  const [modalNotificationType, setModalNotificationType] = useState('');
  const { activeSpace, setActiveSpace } = useSpace();
  const [userLevel, setUserLevel] = useState(0);
  const [spaceInfo, setSpaceInfo] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    setIsScrolled(false);
  }, [location, setIsScrolled]);

  useEffect(() => {
    if (!user && token) {
      loadUser();
    }
  }, [navigationKey, token]);


  async function loadUser() {
    if (!token) {
      setError(new Error("No authentication token available."));
      return;
    }
    try {
      const res = await getUser();
      setUser(res.data);
      setUserLevel(res.data.user_level_display.level_value)
    } catch (error) {
      setError(error);
      localStorage.removeItem("token");
    }
  }

  useEffect(() => {
    if (user && activeSpace?.id) {
      fetchSpaceInfo();
    }
  }, [user, activeSpace]);

  async function fetchSpaceInfo() {
    if (activeSpace?.id) {
      try {
        const response = await getActiveSpace(activeSpace.id);
        setSpaceInfo(response.data);

      } catch (error) {
        console.error('Error fetching active space:', error);
      }
    } else {
      setSpaceInfo(null);
    }
  }

  useEffect(() => {
    const handleProfilePictureUpdate = (event) => {
      setUser(currentUserInfo => ({ ...currentUserInfo, picture: event.detail }));
    };

    window.addEventListener('profilePictureUpdated', handleProfilePictureUpdate);
    return () => {
      window.removeEventListener('profilePictureUpdated', handleProfilePictureUpdate);
    };
  }, []);

  const goToSettings = () => {
    navigate(`/profile/`);
    window.scrollTo(0, 0);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastConnectionDate');
    navigate('/');
    window.location.reload();
  };

  const openModal = (title, context) => {
    setModalTitle(title);
    setModalContext(context);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openRecallsModal = () => {
    setIsRecallsModalOpen(true);
  };

  const closeRecallsModal = () => {
    setIsRecallsModalOpen(false);
  };

  const openNotificationModal = (notificationType) => {
    setModalNotificationType(notificationType);
    setIsNotificationModalOpen(true);
  };

  const closeNotificationModal = (notificationType) => {
    setModalNotificationType(notificationType);
    setIsNotificationModalOpen(false);
  };

  const handleLearningProgramClick = () => {
    navigate('/learn-softskills/', { state: { fromNavigation: true } });
  };

  return (
    <div className="bg-white z-30 shadow p-4 fixed top-0 w-full flex items-center px-4 md:px-12 lg:px-24 xl:px-28 3xl:px-32">
      <div className="flex flex-grow items-center space-x-4 pe-2 border-e-2">
        <div className='flex flex-grow items-center'>
          <Link to="/">
            <img src={logo} alt="" />
          </Link>
          <div className='ps-3'>
            {isScrolled ? (
              <>
                {storyTitle && <div className="text-sm font-semibold py-0 truncate">{storyTitle}</div>}
                {currentCardTitle && <div className="text-sm py-0 truncate">{currentCardTitle}</div>}
              </>
            ) : (
              <span className="text-xl font-semibold">Mixelo</span>
            )}
          </div>
        </div>
        {activeSpace && user && spaceInfo && (
          <div className='flex items-center'>
            <Link to={spaceInfo?.slug ? `/spaces/${spaceInfo.slug}` : '/spaces/'}>
              {spaceInfo?.image ? (<img
                src={spaceInfo.image}
                alt="Profile"
                className="h-10 w-10 rounded-full"
              />) : (<RocketIcon color={spaceInfo.color_name} className="h-10 w-10" />)}

            </Link>
            <ImExit className='text-gray-400 ms-1 cursor-pointer' onClick={() => setActiveSpace(null)} />
          </div>
        )}
      </div>
      <div className="flex items-center ps-2">
        <div className="flex items-center space-x-4">
          {user ? (<Dropdown label="" dismissOnClick={true} renderTrigger={() => (
            <span className='cursor-pointer'>
              {user && user.picture ? (
                <Avatar img={user.picture} alt="Profile" rounded
                  status={user.notifications && user.notifications.has_unread ? "busy" : undefined}
                  statusPosition="top-right" />
              ) : (
                <Avatar img={profile_pic} rounded
                  status={user.notifications && user.notifications.has_unread ? "busy" : undefined}
                  statusPosition="top-right" />
              )}
            </span>
          )}>
            <Dropdown.Item>
              <div className='flex flex-col text-start mb-0 pb-0' onClick={goToSettings} >
                <div className="font-semibold">{user.first_name}</div>
                <div className="text-gray-500 pb-1">{user.email}</div>
                <div className='text-gray-500'>Profile & parameters</div>
              </div>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => navigate('/spaces/')}>
              <span className='text-gray-500 flex items-center justify-items-center'>
                <IoPlanetSharp className='me-3' />
                Spaces
              </span>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => openNotificationModal('like')}>
              <span className='text-gray-500 flex items-center justify-items-center'>
                <HiBellAlert className={`me-3 ${user.notifications && user.notifications.like_count > 0 ? "text-[#3DB1FF]" : ""}`} />
                My notifications {user.notifications && user.notifications.like_count > 0 && <span>&nbsp;({user.notifications.like_count})</span>}
              </span>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => navigate('/new-stories/')}>
              <span className='text-gray-500 flex items-center justify-items-center'>
                <BiSolidBellRing className='me-3' />
                New stories
              </span>
            </Dropdown.Item>
            {userLevel >= CREATOR_LEVEL_1 &&
              <Dropdown.Item onClick={() => navigate('/my-stories/')}>
                <span className='text-gray-500 flex items-center justify-items-center'>
                  <PiTextAlignJustifyFill className='me-3' />
                  My stories
                </span>
              </Dropdown.Item>}
            <Dropdown.Item onClick={openRecallsModal}>
              <span className='text-gray-500 flex items-center justify-items-center'>
                <FaBookmark className='me-3' />
                My recalls</span>
            </Dropdown.Item>
            <Dropdown.Item onClick={handleLearningProgramClick}>
              <span className='text-gray-500 flex items-center justify-items-center'>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className='text-[#3DB1FF] h-[0.9rem] w-[0.9rem] me-3'>
                  <path d="M25.8519 16.963H21.8193L12.5186 26.2637C12.1128 26.6659 11.6659 27.0244 11.1853 27.3333H25.8519C26.2448 27.3333 26.6217 27.1772 26.8995 26.8994C27.1773 26.6216 27.3334 26.2448 27.3334 25.8518V18.4444C27.3334 18.0515 27.1773 17.6747 26.8995 17.3969C26.6217 17.119 26.2448 16.963 25.8519 16.963Z" fill="currentColor" />
                  <path d="M9.55564 0.666656H2.14823C1.75532 0.666656 1.3785 0.822741 1.10066 1.10057C0.822832 1.3784 0.666748 1.75522 0.666748 2.14814V22.1481C0.666748 23.5233 1.21304 24.8422 2.18545 25.8146C3.15786 26.787 4.47674 27.3333 5.85193 27.3333C7.22713 27.3333 8.546 26.787 9.51841 25.8146C10.4908 24.8422 11.0371 23.5233 11.0371 22.1481V2.14814C11.0371 1.75522 10.881 1.3784 10.6032 1.10057C10.3254 0.822741 9.94855 0.666656 9.55564 0.666656ZM5.85193 23.6296C5.55892 23.6296 5.27249 23.5427 5.02887 23.3799C4.78524 23.2172 4.59535 22.9858 4.48322 22.7151C4.37109 22.4444 4.34175 22.1465 4.39892 21.8591C4.45608 21.5717 4.59718 21.3078 4.80437 21.1006C5.01156 20.8934 5.27553 20.7523 5.56291 20.6951C5.85029 20.638 6.14817 20.6673 6.41887 20.7794C6.68958 20.8916 6.92095 21.0814 7.08374 21.3251C7.24653 21.5687 7.33341 21.8551 7.33341 22.1481C7.33341 22.5411 7.17733 22.9179 6.8995 23.1957C6.62167 23.4735 6.24485 23.6296 5.85193 23.6296Z" fill="currentColor" />
                  <path d="M24.566 7.92592L19.3334 2.69332C19.0556 2.41559 18.6788 2.25957 18.286 2.25957C17.8932 2.25957 17.5164 2.41559 17.2386 2.69332L14.0001 5.92592V20.5926L24.566 10.0267C24.7044 9.88899 24.8143 9.72532 24.8892 9.54506C24.9642 9.3648 25.0027 9.1715 25.0027 8.97629C25.0027 8.78107 24.9642 8.58777 24.8892 8.40751C24.8143 8.22725 24.7044 8.06359 24.566 7.92592Z" fill="currentColor" />
                </svg>
                My skills</span>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => openModal('Support us', 'Many ways to support the platform will be available soon.You can always contact us at: contact@mixelo.io. If you\'d like to help out in any way.')}>
              < span className='text-gray-500 flex items-center justify-items-center' >
                <AiFillFire className='me-3 text-[#3DB1FF]' />
                My contribution
              </span>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout} className='text-gray-500'>Logout</Dropdown.Item>
          </Dropdown>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="text-[#3DB1FF]">Login</Link>
              <Link to="/login?view=register" className="text-[#3DB1FF]">Register</Link>
            </div>
          )}

        </div>
      </div >
      {isRecallsModalOpen && <SelectRecallsModal onClose={closeRecallsModal} />
      }
      {isModalOpen && <ComingSoonModal title={modalTitle} context={modalContext} onClose={closeModal} />}
      {isNotificationModalOpen && <NotificationsModal notificationType={modalNotificationType} onClose={closeNotificationModal} />}
    </div >
  );
}
