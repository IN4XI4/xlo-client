import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { listNotifications, updateNotification } from '../../api/blog.api';
import { FaChevronDown } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { useAppState } from '../../context/ScrollContext';
import { useUser } from '../../context/UserContext';
import { NOTIFICATION_CONFIG, DEFAULT_NOTIFICATION_CONFIG } from './notificationConfig';
import '../../App.css'

export function NotificationsModal({ onClose }) {
  const navigate = useNavigate();
  const { refreshNavigation } = useAppState();
  const { setUser } = useUser();
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

  const handleShowMore = () => {
    if (!hasMore || isLoading) return;
    setCurrentPage(prev => prev + 1);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.has_viewed) {
      await updateNotification(notification.id, { has_viewed: true });
      setNotifications(prev =>
        prev.map(n => n.id === notification.id ? { ...n, has_viewed: true } : n)
      );
      setUser(prev => {
        const newUnread = Math.max(0, (prev?.notifications?.total_unread ?? 1) - 1);
        return {
          ...prev,
          notifications: {
            ...prev?.notifications,
            total_unread: newUnread,
            has_unread: newUnread > 0,
          },
        };
      });
    }
    const config = NOTIFICATION_CONFIG[notification.notification_type] ?? DEFAULT_NOTIFICATION_CONFIG;
    config.onClick({ notification, onClose, refreshNavigation, navigate });
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="mt-24 mx-auto border w-80 md:w-96 shadow-lg rounded-md bg-white" onClick={handleModalClick}>
        <div className='flex h-full flex-col'>
          <div className='flex flex-grow border-b-2'>
            <div className="flex-1 overflow-x-hidden h-96 p-1 scrollbar-thin" ref={notificationsRef}>
              {isLoading ? <div></div> : notifications.map((notification, index) => {
                const config = NOTIFICATION_CONFIG[notification.notification_type] ?? DEFAULT_NOTIFICATION_CONFIG;
                return (
                  <div key={index}
                    className={`text-sm cursor-pointer p-1 mb-1 flex items-center ${notification.has_viewed ? 'bg-white' : 'bg-[#3DB1FF]/40'}`}
                    onClick={() => handleNotificationClick(notification)}>
                    <div className='flex items-center justify-center w-5 flex-shrink-0 text-base pe-1'>
                      {config.icon}
                    </div>
                    {config.renderContent(notification)}
                  </div>
                );
              })}
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
