import React, { useEffect, useState } from 'react';
import { FaBookmark, FaHeart, FaReply, FaUser } from 'react-icons/fa';
import { AiFillFire } from "react-icons/ai";
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getUser } from '../api/users.api';
import { Avatar, Dropdown } from 'flowbite-react';
import { useAppState } from '../context/ScrollContext';
import { BiSolidBellRing } from "react-icons/bi";
import { ComingSoonModal } from './ComingSoonModal';
import { NotificationsModal } from './NotificationsModal';
import logo from '../assets/Logo.svg';
import profile_pic from '../assets/Profile-pic.svg';

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState({ data: {} });
  const [error, setError] = useState(null);
  const { isScrolled, storyTitle, currentCardTitle, setIsScrolled, navigationKey } = useAppState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContext, setModalContext] = useState('');
  const [modalNotificationType, setModalNotificationType] = useState('');

  useEffect(() => {
    loadUser();
  }, [navigationKey]);

  useEffect(() => {
    setIsScrolled(false);
  }, [location, setIsScrolled]);

  const token = localStorage.getItem("token");
  async function loadUser() {
    if (!token) {
      setError(new Error("No authentication token available."));
      return;
    }
    try {
      const res = await getUser();
      setUser(res.data);
    } catch (error) {
      setError(error);
      localStorage.removeItem("token");
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

  const openNotificationModal = (notificationType) => {
    setModalNotificationType(notificationType);
    setIsNotificationModalOpen(true);
  };

  const closeNotificationModal = (notificationType) => {
    setModalNotificationType(notificationType);
    setIsNotificationModalOpen(false);
  };

  const handleRecallsClick = () => {
    navigate('/recall-cards/', { state: { fromNavigation: true } });
  };

  return (
    <div className="bg-white z-10 shadow p-4 fixed top-0 w-full flex justify-between items-center px-4 md:px-16 lg:px-32 xl:px-44">
      <div className="flex items-center space-x-4">
        <Link to="/">
          <img src={logo} alt="" />
        </Link>
        <div>
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
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-4">
          <Dropdown label="" dismissOnClick={true} renderTrigger={() => (
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
            <Dropdown.Header>
              <span className="block pb-1 font-semibold">{user.first_name}</span>
              <span className="block text-gray-500">{user.email}</span>
            </Dropdown.Header>
            <Dropdown.Item onClick={goToSettings} className='text-gray-500'>Profil & Paramètres</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={() => navigate('/new-stories/')}>
              <span className='text-gray-500 flex items-center justify-items-center'>
                <BiSolidBellRing className='me-3' />
                Mes nouvelles histoires
              </span>
            </Dropdown.Item>
            <Dropdown.Item onClick={handleRecallsClick}>
              <span className='text-gray-500 flex items-center justify-items-center'>
                <FaBookmark className='me-3' />
                Mes rappels</span>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => openNotificationModal('like')}>
              <span className='text-gray-500 flex items-center justify-items-center'>
                <FaHeart className={`me-3 ${user.notifications && user.notifications.like_count > 0 ? "text-[#3DB1FF]" : ""}`} />
                Mes engagements {user.notifications && user.notifications.like_count > 0 && <span>&nbsp;({user.notifications.like_count})</span>}
              </span>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => openNotificationModal('reply')}>
              <span className='text-gray-500 flex items-center justify-items-center'>
                <FaReply className={`me-3 ${user.notifications && user.notifications.reply_count > 0 ? "text-[#3DB1FF]" : ""}`} />
                Mes conversations {user.notifications && user.notifications.reply_count > 0 && <span>&nbsp;({user.notifications.like_count})</span>}
              </span>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => openModal('Soutenez-Nous', 'Plusieurs manières de supporter la plateforme seront bientôt disponibles. Vous pouvez toujours nous contacter sur contact@mixelo.io si vous souhaitez nous aider de quelconque façon.')}>
              <span className='text-gray-500 flex items-center justify-items-center'>
                <AiFillFire className='me-3 text-[#3DB1FF]' />
                Soutenez-nous
              </span>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleLogout} className='text-gray-500'>Me déconnecter</Dropdown.Item>
          </Dropdown>
        </div>
      </div>
      {isModalOpen && <ComingSoonModal title={modalTitle} context={modalContext} onClose={closeModal} />}
      {isNotificationModalOpen && <NotificationsModal notificationType={modalNotificationType} onClose={closeNotificationModal} />}
    </div >
  );
}
