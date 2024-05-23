import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { getCardsBySoftSkill } from '../api/blog.api';
import { BlocksList } from '../components/topics/BlocksList';
import { getContentTypes } from '../api/base.api';
import { FaRegTimesCircle } from 'react-icons/fa';
import { HiOutlineArrowLeftCircle, HiOutlineArrowRightCircle } from 'react-icons/hi2';


export function LearningProgramPage() {
  const { softskill } = useParams();
  const [softskillCards, setSoftskillCards] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardsCount, setCardsCount] = useState(0);
  const [blockContentTypeId, setBlockContentTypeId] = useState(null);
  const [seed] = useState(() => Math.floor(Math.random() * 1000000));
  const navigate = useNavigate();

  useEffect(() => {
    loadSoftSkillCards(currentPage);
  }, [currentPage]);

  async function loadSoftSkillCards(page) {
    const data = {
      soft_skill: softskill,
      seed: seed,
    };
    try {
      const res = await getCardsBySoftSkill(data, page);
      setCardsCount(res.data.count)

      if (page === 1) {
        setSoftskillCards(res.data.results);
      } else {
        setSoftskillCards(prevStories => [...prevStories, ...res.data.results]);
      }
      setHasMore(!!res.data.next);
      if (page === 1) {
        setCurrentPage(1);
      }
      setLoading(false);
    } catch (error) {
      setError(error);
    }
  }
  const goToNextCard = () => {
    if (currentCardIndex < softskillCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      window.scrollTo(0, 0);
    } else if (hasMore) {
      setCurrentPage(currentPage + 1);
      setCurrentCardIndex(currentCardIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  useEffect(() => {
    loadContentTypes();
  }, []);

  async function loadContentTypes() {
    try {
      const res = await getContentTypes();
      const contentTypes = res.data;
      const blockType = contentTypes.find(ct => ct.model === 'block');
      if (blockType) setBlockContentTypeId(blockType.id);
    } catch (error) {
      console.error('Error al cargar los ContentTypes', error);
    }
  }

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="pt-24 px-4 md:px-16 lg:px-32 xl:px-44">
      {softskillCards.length > 0 && currentCardIndex < softskillCards.length && (
        <>
          <div className='text-xl text-gray-500 pb-3'>
            {softskillCards[currentCardIndex].title}
          </div>
          <div className='md:px-16 lg:px-24 mb-3'>
            <BlocksList card={softskillCards[currentCardIndex]} blockContentTypeId={blockContentTypeId} />
          </div>
        </>
      )}
      <div className="fixed inset-x-0 bottom-0 text-white text-center z-40">
        <div className='bg-[#3DB1FF] px-4 flex py-1'>
          <div className='flex-none flex items-center w-1/4'>
            <span className="ml-2 font-thin text-sm">{cardsCount} {softskillCards.length === 1 ? 'card' : 'cards'}</span>
          </div>
          <div className='flex-grow items-center flex justify-center space-x-4 w-1/2'>
            <div>
              <HiOutlineArrowLeftCircle className='text-4xl cursor-pointer' onClick={goToPreviousCard} />
            </div>
            <div>
              <HiOutlineArrowRightCircle className='text-4xl cursor-pointer' onClick={goToNextCard} />
            </div>
          </div>
          <div className='flex-none  flex items-center w-1/4 justify-end'>
            <FaRegTimesCircle className='text-xl cursor-pointer' onClick={handleBackClick} />
          </div>
        </div>
      </div>
    </div>
  )
}
