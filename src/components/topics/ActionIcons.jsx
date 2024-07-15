import React, { useState } from 'react'
import { deleteRecallBlock, recallBlock } from '../../api/blog.api';
import { FaCheck, FaHeart, FaBookmark, FaRegBookmark, FaRegCopy, FaRegHeart, FaReply } from 'react-icons/fa';
import { Dropdown } from 'flowbite-react';


export function ActionIcons({ hasLiked, onLikeClick, isCopied, copyToClipboard, userHasRecalled, block_id, onRecallUpdate, hideBookmarkAndReply = false }) {
  const navbarHeight = 130;
  const [userRecalled, setUserRecalled] = useState(userHasRecalled.recall);
  const [selectedRecallLevel, setSelectedRecallLevel] = useState(userHasRecalled.level);
  const [recallId, setRecallId] = useState(userHasRecalled.recall_id);

  const getBookmarkColorClass = (level) => {
    switch (level) {
      case "1": return "text-[#FFCE80]";
      case "2": return "text-[#EA929D]";
      default: return "";
    }
  };
  const bookmarkColorClass = getBookmarkColorClass(selectedRecallLevel);
  const scrollToCommentBox = () => {
    const element = document.getElementById("commentArea");
    if (element) {
      const position = element.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({
        top: position,
        behavior: 'smooth'
      });
      setTimeout(() => element.focus(), 500);
    }
  };

  const handleRecallSelection = async (importanceLevel) => {
    if (!userRecalled) {
      const data = {
        block: block_id,
        importance_level: importanceLevel,
      };
      try {
        const response = await recallBlock(data);
        const newRecallId = response.data.id;
        setUserRecalled(true);
        setSelectedRecallLevel(importanceLevel);
        setRecallId(newRecallId);
        onRecallUpdate(block_id, true, importanceLevel, newRecallId);
      } catch (error) {
        console.error('Error al crear el recall:', error);
      }
    }
  }

  const handleDeleteRecall = async () => {
    if (block_id && userRecalled) {
      try {
        await deleteRecallBlock(recallId);
        setUserRecalled(false);
        setRecallId(null);
        onRecallUpdate(block_id, null, null, false);
      } catch (error) {
        console.error('Error al eliminar el recall:', error);
      }
    }
  };

  return (
    <div className='flex justify-end space-x-2 items-center text-gray-500 py-1 pe-6'>
      {isCopied ? <FaCheck className='text-lg md:text-xl cursor-pointer' onClick={copyToClipboard} /> :
        <FaRegCopy className='text-lg md:text-xl cursor-pointer' onClick={copyToClipboard} />}
      {hasLiked ? <FaHeart className='text-lg md:text-xl cursor-pointer' onClick={onLikeClick} />
        : <FaRegHeart className='text-lg md:text-xl cursor-pointer' onClick={onLikeClick} />}
      {!hideBookmarkAndReply && (
        <>
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
          <FaReply className='md:text-xl cursor-pointer' onClick={scrollToCommentBox} />
        </>
      )}

    </div>
  );
}
