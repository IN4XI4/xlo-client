import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { listNotifications, updateNotification } from '../../api/blog.api';
import { FaHeart, FaReply, FaChevronDown, FaLevelUpAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useAppState } from '../../context/ScrollContext';

import '../../App.css'
import user_image from '../../assets/user_image.svg';

const NOTIFICATION_ICONS = {
  like: <FaHeart className="text-gray-400" />,
  reply: <FaReply className="text-gray-400" />,
  level_up: <FaLevelUpAlt className="text-gray-400" />,
};

export function NotificationsModal({ onClose }) {
  const navigate = useNavigate();
  const { refreshNavigation } = useAppState();
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const notificationsRef = useRef(null);

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  const loadNotifications = async (page = currentPage) => {
    const currentScrollPosition = notificationsRef.current ? notificationsRef.current.scrollTop : 0;
    setIsLoading(true);
    try {
      const res = await listNotifications(page);
      if (page === 1) {
        setNotifications(res.data.results);
      } else {
        setNotifications(prev => [...prev, ...res.data.results]);
      }
      setHasMore(res.data.next !== null);
    } catch (error) {
      setError(error);
    } finally {
      setIsLoading(false);
      setTimeout(() => {
        if (notificationsRef.current) {
          notificationsRef.current.scrollTop = currentScrollPosition;
        }
      }, 0);
    }
  };

  useEffect(() => {
    loadNotifications(1);
  }, []);

  useEffect(() => {
    if (currentPage > 1) {
      loadNotifications();
    }
  }, [currentPage]);

  const renderNotificationContent = (notification) => {
    if (notification.notification_type === 'level_up') {
      const { new_level, new_level_name, coins_awarded } = notification.metadata || {};
      return (
        <div className='flex-1'>
          <span className='font-bold'>🎉 Congratulations!</span>
          <div className='text-gray-600'>
            You reached level {new_level} — <span className='font-semibold'>{new_level_name}</span>!
          </div>
          <div className='text-yellow-600 font-medium'>🪙 +{coins_awarded} MXC earned!</div>
        </div>
      );
    }
    return (
      <>
        <div className='flex items-center justify-center px-1 flex-shrink-0'>
          {notification.user_picture ?
            <img src={notification.user_picture} className='h-6 w-6 rounded-full' alt="" /> :
            <img src={user_image} className='h-6 w-6' alt="" />}
        </div>
        <div className='flex-1 truncate'>
          <span className='font-bold pe-1'>{notification.user_action}</span>
          <span className='text-gray-500'>{notification.formatted_date}</span>
          <div className='text-gray-500 truncate'>{notification.comment_details?.text}</div>
        </div>
      </>
    );
  };

  const handleShowMore = () => {
    if (!hasMore || isLoading) return;
    setCurrentPage(prev => prev + 1);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.has_viewed) {
      await updateNotification(notification.id, { has_viewed: true });
    }
    if (notification.notification_type === 'level_up') {
      onClose();
      refreshNavigation();
      navigate('/avatar');
      window.scrollTo(0, 0);
      return;
    }
    onClose();
    refreshNavigation();
    setTimeout(() => {
      navigate(`/story/${notification.comment_details.story_slug}`, { state: { scrollToComments: true }, key: Date.now() });
    }, 150);
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="mt-24 mx-auto border w-80 md:w-96 shadow-lg rounded-md bg-white" onClick={handleModalClick}>
        <div className='flex h-full flex-col'>
          <div className='flex flex-grow border-b-2'>
            <div className="flex-1 overflow-x-hidden h-96 p-1 scrollbar-thin" ref={notificationsRef}>
              {isLoading ? <div></div> : notifications.map((notification, index) => (
                <div key={index}
                  className={`text-sm cursor-pointer p-1 mb-1 flex items-center ${notification.has_viewed ? 'bg-white' : 'bg-[#D8EFFF]'}`}
                  onClick={() => handleNotificationClick(notification)}>
                  <div className='flex items-center justify-center w-5 flex-shrink-0 text-base pe-1'>
                    {NOTIFICATION_ICONS[notification.notification_type]}
                  </div>
                  {renderNotificationContent(notification)}
                </div>
              ))}
            </div>
          </div>
          <div className='flex'>
            <div className='flex-grow flex items-center justify-center text-gray-500 cursor-pointer' onClick={handleShowMore}>
              <FaChevronDown className='text-xl' />
            </div>
            <div className='w-10 flex items-center justify-center text-gray-500 border-l-2 cursor-pointer'
              onClick={onClose}>
              <IoMdClose className='text-2xl' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
