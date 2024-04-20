import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { listLikeNotifications, listReplyNotifications, updateNotification } from '../api/blog.api';
import { FaHeart, FaReply, FaChevronDown } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import '../App.css'


export function NotificationsModal({ notificationType: initialNotificationType, onClose }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [error, setError] = useState(null);
  const [likeNotifications, setLikeNotifications] = useState([]);
  const [replyNotifications, setReplyNotifications] = useState([]);
  const [notificationType, setNotificationType] = useState(initialNotificationType);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const notificationsRef = useRef(null);

  const handleBackgroundClick = () => {
    onClose();
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  const loadNotifications = async (page = currentPage) => {
    const currentScrollPosition = notificationsRef.current ? notificationsRef.current.scrollTop : 0;
    setIsLoading(true);
    try {
      let newNotifications = [];
      if (notificationType === 'like') {
        const res = await listLikeNotifications(page);
        newNotifications = res.data.results;
        if (page === 1) {
          setLikeNotifications(newNotifications);
          setReplyNotifications([]);
        } else {
          setLikeNotifications(prevNotifications => [...prevNotifications, ...newNotifications]);
        }
        setHasMore(res.data.next !== null);
      } else if (notificationType === 'reply') {
        const res = await listReplyNotifications(page);
        newNotifications = res.data.results;
        if (page === 1) {
          setReplyNotifications(newNotifications);
          setLikeNotifications([]);
        } else {
          setReplyNotifications(prevNotifications => [...prevNotifications, ...newNotifications]);
        }
        setHasMore(res.data.next !== null);
      }
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
  }

  useEffect(() => {
    setCurrentPage(1);
    loadNotifications(1);
  }, [notificationType]);

  useEffect(() => {
    if (currentPage > 1) {
      loadNotifications();
    }
  }, [currentPage]);

  const handleShowMore = () => {
    if (!hasMore) return;
    if (!isLoading) {
      setCurrentPage(prevPage => {
        return prevPage + 1;
      });
    }
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.has_viewed) {
      await updateNotification(notification.id, { has_viewed: true });
    }
    onClose();
    setTimeout(() => {
      navigate(`/story/${notification.comment_details.story_id}`, { state: { scrollToComments: true } });
    }, 150);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="mt-24 mx-auto border w-80 md:w-96 shadow-lg rounded-md bg-white" onClick={handleModalClick}>
        <div className='flex h-full flex-col'>
          <div className='flex flex-grow border-b-2'>
            <div className="flex-1 overflow-x-hidden h-96 p-1 scrollbar-thin" ref={notificationsRef}>
              {isLoading ? <div></div> : (notificationType === 'like' ? likeNotifications.map((notification, index) => (
                <div key={index}
                  className={`text-sm cursor-pointer p-1 mb-1 flex ${notification.has_viewed ? 'bg-white' : 'bg-[#D8EFFF]'}`}
                  onClick={() => handleNotificationClick(notification)}>
                  <div className='flex items-center justify-center px-1 custom-scrollbar'>
                    {notification.user_picture ?
                      <img src={notification.user_picture} className='h-6 w-6 rounded-full' alt="" /> :
                      <img src="src/assets/user_image.svg" className='h-6 w-6' alt="" />}
                  </div>
                  <div className='flex-1 truncate'>
                    <span className='font-bold'>{notification.user_action}</span>
                    <span className='text-gray-500'> a aimé:</span>
                    <div className='text-gray-500 truncate'>{notification.comment_details.text}</div>
                  </div>
                </div>
              )) : replyNotifications.map((notification, index) => (
                <div key={index}
                  className={`text-sm cursor-pointer p-1 mb-1 flex ${notification.has_viewed ? 'bg-white' : 'bg-[#D8EFFF]'}`}
                  onClick={() => handleNotificationClick(notification)}>
                  <div className='flex items-center justify-center px-1 custom-scrollbar'>
                    {notification.user_picture ?
                      <img src={notification.user_picture} className='h-6 w-6 rounded-full' alt="" /> :
                      <img src="src/assets/user_image.svg" className='h-6 w-6' alt="" />}
                  </div>
                  <div className='flex-1 truncate'>
                    <span className='font-bold pe-1'>{notification.user_action}</span>
                    <span className='text-gray-500'>{notification.formatted_date}</span>
                    <div className='text-gray-500 truncate'>{notification.comment_details.text}</div>
                  </div>

                </div>
              )))}
            </div>
            <div className='flex-none w-10 flex flex-col h-96 border-l-2'>
              <div className={`flex-1 flex items-center justify-center border-b-2 rounded-tr cursor-pointer
              ${notificationType === 'like' ? 'bg-[#9CA3AF] text-white' : 'bg-white text-gray-500'}`}
                onClick={() => setNotificationType('like')}>
                <FaHeart />
              </div>
              <div className={`flex-1 flex items-center justify-center cursor-pointer
              ${notificationType === 'reply' ? 'bg-[#9CA3AF] text-white' : 'bg-white text-gray-500'}`}
                onClick={() => setNotificationType('reply')}>
                <FaReply />
              </div>
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
  )
}
