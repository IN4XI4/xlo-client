import React, { useEffect, useState } from 'react'
import { FaRegBookmark, FaRegHeart, FaHeart, FaReply, FaUser, FaRegCopy, FaCheck, FaBookmark } from 'react-icons/fa';
import { RepliesList } from './RepliesList';
import { deleteLike, deleteRecallComment, likeSomething, recallComment } from '../../../api/blog.api';
import { ProfileModal } from '../../ProfileModal';
import { Dropdown } from 'flowbite-react';


const ActionIcons = ({ onReplyClick, userHasLiked, onLikeClick, isCopied, copyToClipboard, userHasRecalled, comment_id }) => {
  const [selectedRecallLevel, setSelectedRecallLevel] = useState(userHasRecalled.level);
  const [userRecalled, setUserRecalled] = useState(userHasRecalled.recall);
  const [recallId, setRecallId] = useState(userHasRecalled.recall_id);

  const getBookmarkColorClass = (level) => {
    switch (level) {
      case "1": return "text-[#FFCE80]";
      case "2": return "text-[#EA929D]";
      default: return "";
    }
  };
  const handleRecallSelection = async (importanceLevel) => {
    if (!userRecalled) {
      const data = {
        comment: comment_id,
        importance_level: importanceLevel,
      };
      try {
        const response = await recallComment(data);
        const newRecallId = response.data.id;
        setUserRecalled(true);
        setSelectedRecallLevel(importanceLevel);
        setRecallId(newRecallId);
      } catch (error) {
        console.error('Error al crear el recall:', error);
      }
    }
  }

  const handleDeleteRecall = async () => {
    if (comment_id && userRecalled) {
      try {
        await deleteRecallComment(recallId);
        setUserRecalled(false);
        setRecallId(null);
      } catch (error) {
        console.error('Error al eliminar el recall:', error);
      }
    }
  };

  const bookmarkColorClass = getBookmarkColorClass(selectedRecallLevel);
  return (
    <div className='flex justify-end space-x-2 items-center text-gray-500'>
      {isCopied ? <FaCheck className='text-lg md:text-xl cursor-pointer' onClick={copyToClipboard} /> :
        <FaRegCopy className='text-lg md:text-xl cursor-pointer' onClick={copyToClipboard} />}
      {userHasLiked ? <FaHeart className='text-lg md:text-xl cursor-pointer' onClick={onLikeClick} />
        : <FaRegHeart className='text-lg md:text-xl cursor-pointer' onClick={onLikeClick} />}
      {userRecalled ?
        <FaBookmark className={`text-lg md:text-xl cursor-pointer ${bookmarkColorClass}`} onClick={handleDeleteRecall} /> : (
          <Dropdown className='w-[280px]' label="" dismissOnClick={true} renderTrigger={() => (
            <span className='text-gray-500 flex items-center justify-center cursor-pointer me-4 md:me-6'>
              <FaRegBookmark className='text-lg md:text-xl' />
            </span>
          )}>
            <Dropdown.Header>
              <span className="block pb-1 font-semibold">Recall</span>
              <span className="block text-gray-500 text-[0.85rem]">Select the “Recall” importance level!
                This will impact the number of times you will see this card on the “Recall-Mode”.</span>
            </Dropdown.Header>
            <Dropdown.Item onClick={() => handleRecallSelection("1")}>
              <span className='text-gray-500 flex items-center justify-items-center'>
                <FaBookmark className='text-[#FFCE80] me-4 md:me-6' />
                Important
              </span>
            </Dropdown.Item>
            <Dropdown.Item onClick={() => handleRecallSelection("2")}>
              <span className='text-gray-500 flex items-center justify-items-center'>
                <FaBookmark className='text-[#EA929D] me-4 md:me-6' />
                Very Important
              </span>
            </Dropdown.Item>
          </Dropdown>
        )
      }
      <FaReply className='text-lg md:text-xl cursor-pointer' onClick={onReplyClick} />
    </div>
  )
};

export function CommentCard({ comment, isReply, onReply, commentContentTypeId }) {
  const [showReplies, setShowReplies] = useState(false);
  const [userHasLiked, setUserHasLiked] = useState(comment.user_has_liked);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleReplyClick = () => {
    const parentId = isReply ? comment.parent : comment.id;
    onReply(parentId, comment.comment_text);
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };
  const cardBackgroundClass = isReply ? 'bg-white' : 'bg-[#F5FBFF]';

  const handleLikeClick = async () => {
    try {
      if (typeof userHasLiked === 'number') {
        await deleteLike(userHasLiked);
        setUserHasLiked(false);
      } else {
        const data = {
          liked: true,
          content_type: commentContentTypeId,
          object_id: comment.id,
          is_active: true
        };
        const response = await likeSomething(data);
        setUserHasLiked(response.data.id);
      }
    } catch (error) {
      console.error("Error processing like/unlike:", error);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(comment.comment_text)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 5000);
      })
      .catch((error) => {
        console.error('Error copying content to clipboard', error);
      });
  };

  return (
    <div className='flex my-3 text-sm md:text-base'>
      <div className='flex-none me-1 md:me-3'>
        {comment.user_picture ? (
          <img src={comment.user_picture} alt="Mentor" className="h-8 w-8 md:h-12 md:w-12 rounded-full cursor-pointer"
            onClick={() => isAuthenticated && openModal()} />
        ) : <div className='p-2 md:p-4 rounded-full bg-gray-200 text-gray-500 cursor-pointer' onClick={() => isAuthenticated && openModal()}><FaUser /></div>}
      </div>
      <div className={`flex-grow ${cardBackgroundClass} rounded-lg p-4 rounded-tl-none`}>
        <div className=''>
          <div className="">
            <span className='font-bold cursor-pointer' onClick={() => isAuthenticated && openModal()}>{comment.user_name}</span> <span className='text-gray-500'>{comment.formatted_created_time}</span>
          </div>
          <div className='pb-3'>
            {comment.comment_text}
          </div>
          {isAuthenticated &&
            <ActionIcons onReplyClick={handleReplyClick} userHasLiked={userHasLiked} onLikeClick={handleLikeClick}
              isCopied={isCopied} copyToClipboard={copyToClipboard} userHasRecalled={comment.user_has_recalled}
              comment_id={comment.id} />}
          {comment.replies_count > 0 && (
            <div className="pt-2 flex justify-end">
              <button
                className="text-blue-500"
                onClick={toggleReplies}
              >
                {showReplies ? '-- Hide replies --' : `-- Show ${comment.replies_count} replies --`}
              </button>
            </div>
          )}
          {showReplies && <RepliesList commentId={comment.id} onReply={onReply} commentContentTypeId={commentContentTypeId} />}
        </div>
      </div>
      {isModalOpen && <ProfileModal userId={comment.user} onClose={closeModal} />}
    </div>
  )
}
