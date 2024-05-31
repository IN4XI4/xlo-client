import React, { useState } from 'react'
import { FaCheck, FaRegBell, FaRegCopy, FaRegThumbsDown, FaRegThumbsUp, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { deleteLike, likeSomething, updateLike } from '../../api/blog.api';


export function InteractBox({ story, setStory, storyContentTypeId }) {
  const [isCopied, setIsCopied] = useState(false);

  const handleLikeOrDislike = async (isLike) => {
    const alreadyLiked = story.user_has_liked.liked;
    const alreadyDisliked = story.user_has_liked.disliked;

    if ((isLike && alreadyLiked) || (!isLike && alreadyDisliked)) {
      try {
        await deleteLike(story.user_has_liked.like_id);
        setStory({
          ...story,
          user_has_liked: { ...story.user_has_liked, liked: false, disliked: false, like_id: null }
        });
      } catch (error) {
        console.error('Error removing like/dislike', error);
      }
    } else if ((isLike && alreadyDisliked) || (!isLike && alreadyLiked)) {
      const data = { liked: isLike };
      try {
        await updateLike(story.user_has_liked.like_id, data);
        setStory({
          ...story,
          user_has_liked: { ...story.user_has_liked, liked: isLike, disliked: !isLike }
        });
      } catch (error) {
        console.error('Error updating like/dislike', error);
      }
    } else {
      const data = {
        liked: isLike,
        content_type: storyContentTypeId,
        object_id: story.id,
        is_active: true
      };
      try {
        const response = await likeSomething(data);
        setStory({
          ...story,
          user_has_liked: { ...story.user_has_liked, liked: isLike, disliked: !isLike, like_id: response.data.id }
        });
      } catch (error) {
        console.error('Error adding like/dislike', error);
      }
    }
  };

  const copyToClipboard = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 5000);
      })
      .catch((error) => {
        console.error('Error copying URL to clipboard', error);
      });
  };

  return (
    <div className='flex items-center justify-center md:px-16 lg:px-24 mt-2 mb-4 space-x-2 md:space-x-3 py-3'>
      <div className={`w-10 h-10 md:w-12 md:h-12 p-2 rounded-full flex items-center justify-center ${story.user_has_liked.disliked ? 'text-[#3DB1FF] bg-[#D8EFFF]' : 'text-gray-500 bg-white'} cursor-pointer`}
        onClick={() => handleLikeOrDislike(false)}>
        <FaRegThumbsDown className='text-sm md:text-lg' />
      </div>
      <div className='w-10 h-10 md:w-12 md:h-12 p-2 bg-white rounded-full text-sm text-gray-500 flex justify-center items-center cursor-pointer'
        onClick={copyToClipboard}>
        <div>
          {isCopied ? <FaCheck className='md:text-xl' /> : <FaRegCopy className='md:text-xl' />}
        </div>
      </div>
      <div className='w-10 h-10 md:w-12 md:h-12 p-2 bg-white rounded-full text-sm text-gray-500 flex justify-center items-center cursor-pointer'>
        <div>
          <FaRegBell className='md:text-xl' />
        </div>
      </div>
      <div className={`w-10 h-10 md:w-12 md:h-12 p-2 rounded-full flex items-center justify-center ${story.user_has_liked.liked ? 'text-[#3DB1FF] bg-[#D8EFFF]' : 'text-gray-500 bg-white'} cursor-pointer`}
        onClick={() => handleLikeOrDislike(true)}>
        <FaRegThumbsUp className='text-sm md:text-lg' />
      </div>
    </div>
  )
}
