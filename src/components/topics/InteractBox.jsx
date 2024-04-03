import { Dropdown } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { FaBookmark, FaPlus, FaRegBell, FaRegBookmark, FaRegHeart, FaReply, FaUserEdit } from 'react-icons/fa';
import { FiShare2 } from "react-icons/fi";
import { deleteRecallCard, recallCard } from '../../api/blog.api';


export function InteractBox({ user_has_recalled, recall_level, recall_id, card_id, onUpdateRecall }) {
  const [userHasRecalled, setUserHasRecalled] = useState(user_has_recalled);
  const [selectedRecallLevel, setSelectedRecallLevel] = useState(recall_level);
  const [recallId, setRecallId] = useState(recall_id);


  const getBookmarkColorClass = (level) => {
    switch (level) {
      case "1": return "text-[#FFCE80]";
      case "2": return "text-[#EA929D]";
      default: return "";
    }
  };

  const bookmarkColorClass = getBookmarkColorClass(selectedRecallLevel);

  useEffect(() => {
    setUserHasRecalled(user_has_recalled);
  }, [user_has_recalled]);

  useEffect(() => {
    setSelectedRecallLevel(recall_level);
  }, [recall_level]);

  useEffect(() => {
    setRecallId(recall_id);
  }, [recall_id]);

  const handleRecallSelection = async (importanceLevel) => {
    console.log("esta entrando", userHasRecalled);
    if (!userHasRecalled) {
      const data = {
        card: card_id,
        importance_level: importanceLevel,
      };
      try {
        console.log("data", data);
        const response = await recallCard(data);
        const newRecallId = response.data.id;
        setUserHasRecalled(true);
        setSelectedRecallLevel(importanceLevel);
        setRecallId(newRecallId);
        onUpdateRecall(response.data.id, importanceLevel, true);
        console.log('Recall creado con data:', response.data);
      } catch (error) {
        console.error('Error al crear el recall:', error);
      }
    }
  }

  const handleDeleteRecall = async () => {
    if (recall_id && userHasRecalled) {
      try {
        await deleteRecallCard(recallId);
        setUserHasRecalled(false);
        setRecallId(null);
        onUpdateRecall(null, null, false);
        console.log('Recall eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar el recall:', error);
      }
    }
  };

  return (
    <div className='flex items-center justify-center md:px-16 lg:px-24 mt-2 mb-4 space-x-2 md:space-x-3 py-3'>
      {userHasRecalled ? (
        <span className={`w-8 h-8 md:w-12 md:h-12 p-2 bg-white rounded-full text-sm text-gray-500 flex items-center justify-center cursor-pointer `}
          onClick={handleDeleteRecall}>
          <FaBookmark className={`md:text-xl ${bookmarkColorClass}`} />
        </span>
      ) : (
        <Dropdown className='w-[280px]' label="" dismissOnClick={true} renderTrigger={() => (
          <span className='w-8 h-8 md:w-12 md:h-12 p-2 bg-white rounded-full text-sm text-gray-500 flex items-center justify-center cursor-pointer'>
            <FaRegBookmark className='md:text-xl' />
          </span>
        )}>
          <Dropdown.Header>
            <span className="block pb-1 font-semibold">Recall</span>
            <span className="block text-gray-500 text-[0.85rem]">Select the “Recall” importance level!
              This will impact the number of times you will see this card on the “Recall-Mode”.</span>
          </Dropdown.Header>
          <Dropdown.Item onClick={() => handleRecallSelection("1")}>
            <span className='text-gray-500 flex items-center justify-items-center'>
              <FaBookmark className='text-[#FFCE80] me-3' />
              Important
            </span>
          </Dropdown.Item>
          <Dropdown.Item onClick={() => handleRecallSelection("2")}>
            <span className='text-gray-500 flex items-center justify-items-center'>
              <FaBookmark className='text-[#EA929D] me-3' />
              Very Important
            </span>
          </Dropdown.Item>
        </Dropdown>
      )}

      <div className='w-8 h-8 md:w-12 md:h-12 p-2 bg-white text-sm rounded-full text-gray-500 flex justify-center items-center cursor-pointer'>
        <div>
          <FaRegHeart className='md:text-xl' />
        </div>
      </div>
      <div className='w-8 h-8 md:w-12 md:h-12 p-2 bg-white rounded-full text-sm text-gray-500 flex justify-center items-center cursor-pointer'>
        <div>
          <FiShare2 className='md:text-xl' />
        </div>
      </div>
      <div className='w-8 h-8 md:w-12 md:h-12 p-2 bg-white rounded-full text-sm text-gray-500 flex justify-center items-center cursor-pointer'>
        <div>
          <FaPlus className='md:text-xl' />
        </div>
      </div>
      <div className='w-8 h-8 md:w-12 md:h-12 p-2 bg-white rounded-full text-sm text-gray-500 flex justify-center items-center cursor-pointer'>
        <div>
          <FaUserEdit className='md:text-xl' />
        </div>
      </div>
      <div className='w-8 h-8 md:w-12 md:h-12 p-2 bg-white text-sm rounded-full text-gray-500 flex justify-center items-center cursor-pointer'>
        <div>
          <FaRegBell className='md:text-xl' />
        </div>
      </div>
      <div className='p-2 md:p-3 text-white bg-[#3db1ff] rounded-full border-2 border-[#43ADCC] cursor-pointer'>
        <FaReply className='md:text-xl' />
      </div>
    </div>
  )
}
