import React, { useState } from 'react'
import { FaRegBookmark, FaRegHeart, FaHeart, FaReply, FaUser } from 'react-icons/fa';
import { RepliesList } from './RepliesList';


const ActionIcons = ({ onReplyClick, userHasLiked }) => (
  <div className='flex justify-end space-x-2 items-center text-gray-500'>
    {userHasLiked ? <FaHeart className='md:text-xl cursor-pointer' /> 
                 : <FaRegHeart className='md:text-xl cursor-pointer' />}
    <FaRegBookmark className='md:text-xl' />
    <FaReply className='md:text-xl cursor-pointer' onClick={onReplyClick} />
    <div className='cursor-pointer' onClick={onReplyClick}>Comment</div>
  </div>
);

export function CommentCard({ comment, isReply, onReply, commentContentTypeId }) {
  const [showReplies, setShowReplies] = useState(false);
  const handleReplyClick = () => {
    const parentId = isReply ? comment.parent : comment.id;
    onReply(parentId, comment.comment_text);
  };

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };
  const cardBackgroundClass = isReply ? 'bg-white' : 'bg-[#F5FBFF]';

  return (
    <div className='flex my-3 text-sm md:text-base'>
      <div className='flex-none me-1 md:me-3'>
        {comment.user_picture ? (
          <img src={comment.user_picture} alt="Mentor" className="h-8 w-8 md:h-12 md:w-12 rounded-full" />
        ) : <div className='p-2 md:p-4 rounded-full bg-gray-200 text-gray-500'><FaUser /></div>}
      </div>
      <div className={`flex-grow ${cardBackgroundClass} rounded-lg p-4 rounded-tl-none`}>
        <div className=''>
          <div className="">
            <span className='font-bold'>{comment.user_name}</span> <span className='text-gray-500'>{comment.formatted_created_time}</span>
          </div>
          <div className='pb-3 break-all'>
            {comment.comment_text}
          </div>
          <ActionIcons onReplyClick={handleReplyClick} userHasLiked={comment.user_has_liked}/>
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
          {showReplies && <RepliesList commentId={comment.id} onReply={onReply} commentContentTypeId={commentContentTypeId}/>}
        </div>
      </div>
    </div>
  )
}
