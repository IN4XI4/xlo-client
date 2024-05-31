import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaBookmark, FaRegBookmark, FaReply } from 'react-icons/fa';
import { deleteRecallCard, recallCard } from '../../api/blog.api';
import { Dropdown } from 'flowbite-react';
import { HiArrowNarrowLeft, HiArrowNarrowRight } from "react-icons/hi";
import { CgArrowTopLeft } from "react-icons/cg";


export function StoryNavBar({ topicSlug, goToPreviousCard, goToNextCard, user_has_recalled, recall_level, recall_id, card_id, onUpdateRecall, isAuthenticated, previousStorySlug, nextStorySlug }) {
  const [userHasRecalled, setUserHasRecalled] = useState(user_has_recalled);
  const [selectedRecallLevel, setSelectedRecallLevel] = useState(recall_level);
  const [recallId, setRecallId] = useState(recall_id);
  const navbarHeight = 130;
  const navigate = useNavigate();

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
    if (!userHasRecalled) {
      const data = {
        card: card_id,
        importance_level: importanceLevel,
      };
      try {
        const response = await recallCard(data);
        const newRecallId = response.data.id;
        setUserHasRecalled(true);
        setSelectedRecallLevel(importanceLevel);
        setRecallId(newRecallId);
        onUpdateRecall(response.data.id, importanceLevel, true);
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

  const goToPreviousStory = () => {
    if (previousStorySlug) {
      navigate(`/story/${previousStorySlug}`);
    }
  };

  const goToNextStory = () => {
    if (nextStorySlug) {
      navigate(`/story/${nextStorySlug}`);
    }
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 flex justify-center items-center p-2 z-50'>
      <div className='flex justify-center items-center bg-white shadow-md rounded-full py-2 px-4'>
        {isAuthenticated && (
          <>
            {userHasRecalled ? (
              <span className={` text-gray-500 flex items-center justify-center cursor-pointer me-4 md:me-6`}
                onClick={handleDeleteRecall}>
                <FaBookmark className={`md:text-lg ${bookmarkColorClass}`} />
              </span>
            ) : (
              <Dropdown className='w-[280px]' label="" dismissOnClick={true} renderTrigger={() => (
                <span className='text-gray-500 flex items-center justify-center cursor-pointer me-4 md:me-6'>
                  <FaRegBookmark className='md:text-lg' />
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
            )}
            <div className='flex items-center text-gray-500 cursor-pointer  me-4 md:me-6'
              onClick={goToPreviousStory}>
              <FaAngleDoubleLeft className='text-lg md:text-xl' />
            </div>
          </>
        )}
        <div className='flex items-center p-2 text-white bg-[#3DB1FF] rounded-full cursor-pointer  me-4 md:me-6'
          onClick={goToPreviousCard}>
          <HiArrowNarrowLeft className='text-lg md:text-xl' />
        </div>
        <Link to={`/topic/${topicSlug}`} className=''>
          <div className='p-1 md:p-2 text-gray-500 bg-gray-200 border rounded-full me-4 md:me-6'>
            <CgArrowTopLeft className='text-xl' />
          </div>
        </Link>
        <div className='flex items-center p-2 text-white bg-[#3DB1FF] rounded-full cursor-pointer'
          onClick={goToNextCard}>
          <HiArrowNarrowRight className='text-lg md:text-xl' />
        </div>
        {isAuthenticated && (
          <>
            <div className='flex items-center text-gray-500 cursor-pointer ms-4 md:ms-6 me-4 md:me-6'
              onClick={goToNextStory}>
              <FaAngleDoubleRight className='text-lg md:text-xl' />
            </div>
            <div className='flex items-center text-gray-500 cursor-pointer' onClick={scrollToCommentBox}>
              <FaReply className='text-lg' />
            </div>
          </>
        )}
      </div>

    </div>
  )
}
