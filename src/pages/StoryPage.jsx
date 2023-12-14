import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import { getCardsByStory, getStory } from '../api/blog.api';
import { BlocksList } from '../components/topics/BlocksList';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaArrowLeft, FaSync, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { Progress } from 'flowbite-react';
import { InteractBox } from '../components/topics/InteractBox';
import { CommentsList } from '../components/topics/comments/CommentsList';

export function StoryPage() {
  const { id } = useParams();
  const [story, setStory] = useState([]);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardsLoaded, setIsCardsLoaded] = useState(false);
  const progressPercentage = cards.length > 0 ? (currentCardIndex + 1) / cards.length * 100 : 0;


  const goToNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
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

  const goToFirstCard = () => {
    setCurrentCardIndex(0);
    window.scrollTo(0, 0); 
  };

  const goToLastCard = () => {
    setCurrentCardIndex(cards.length - 1);
    window.scrollTo(0, 0); 
  };

  useEffect(() => {
    loadStory();
  }, [id]);
  async function loadStory() {
    try {
      const res = await getStory(id);
      setStory(res.data);
      const cardsResponse = await getCardsByStory(id);
      setCards(cardsResponse.data.results);
      setIsCardsLoaded(true); 
    } catch (error) {
      setError(error);
    }
  }
  return (
    <div className="pt-20 md:pt-28 px-4 md:px-16 lg:px-32 xl:px-44">
      <div className='text-4xl font-extrabold pb-2'>
        {story.title}
      </div>
      {cards.length > 0 && currentCardIndex < cards.length && (
        <>
          <div className='text-xl text-gray-500 pb-3'>
            {cards[currentCardIndex].title}
          </div>
          <div className='md:px-16 lg:px-24 mb-3'>
            <BlocksList card={cards[currentCardIndex]} />
          </div>
          <div className='flex justify-center items-center p-2 mt-4 md:mt-8 '>
            <div className='flex items-center'>
              <div className='p-2 md:p-3 text-gray-500 bg-white border rounded-l-lg hover:text-[#3DB1FF] hover:bg-[#D8EFFF] hover:cursor-pointer'>
                <FaThumbsDown className='text-lg md:text-xl' />
              </div>
              <div className='flex items-center p-2 md:p-3 text-gray-500 bg-white border hover:text-[#3DB1FF] hover:bg-[#D8EFFF] hover:cursor-pointer'
                onClick={goToFirstCard}>
                <FaAngleDoubleLeft className='text-lg md:text-xl' />
              </div>
              <div className='flex items-center p-2 md:p-3 text-gray-500 bg-white border rounded-r-lg hover:text-[#3DB1FF] hover:bg-[#D8EFFF] hover:cursor-pointer'
                onClick={goToPreviousCard}>
                <FaAngleLeft className='text-lg md:text-xl md:mr-2' />
                <span className='text-sm md:text-base hidden md:block' style={{ lineHeight: '1' }}>Previous</span>
              </div>
            </div>
            <Link to={`/topic/${story.topic}`} className='mx-2 md:mx-6'>
              <div className='p-2 md:p-3 text-gray-500 bg-gray-200 border rounded-lg'><FaArrowLeft className='text-base md:text-xl' /></div>
            </Link>
            <div className='flex items-center'>
              <div className='flex items-center justify-center p-2 md:p-3 text-gray-500 bg-white border rounded-l-lg hover:text-[#3DB1FF] hover:bg-[#D8EFFF] hover:cursor-pointer'
                onClick={goToNextCard}>
                <FaAngleRight className='text-lg md:text-xl md:mr-2' />
                <span className='text-sm md:text-base hidden md:block' style={{ lineHeight: '1' }}>Next</span>
              </div>
              <div className='flex items-center p-2 md:p-3 text-gray-500 bg-white border hover:text-[#3DB1FF] hover:bg-[#D8EFFF] hover:cursor-pointer'
                onClick={goToLastCard}>
                <FaAngleDoubleRight className='text-lg md:text-xl' />
              </div>
              <div className='p-2 md:p-3 text-gray-500 bg-white border rounded-r-lg hover:text-[#3DB1FF] hover:bg-[#D8EFFF] hover:cursor-pointer'>
                <FaThumbsUp className='text-lg md:text-xl' />
              </div>
            </div>
          </div>
          <div className='md:px-16 lg:px-24 mb-4'>
            <div className='text-end text-sm text-gray-500'>
              {progressPercentage.toFixed(0)}%
            </div>
            <div className='flex items-center'>
              <div className='flex-none text-gray-500 mr-4 hover:cursor-pointer' onClick={goToFirstCard}>
                <FaSync />
              </div>
              <div className='flex-1'>
                <Progress progress={progressPercentage.toFixed(0)} />
              </div>
            </div>
          </div>
          <InteractBox />
          <div className='flex justify-center text-gray-500 mb-4 border-b-4 border-[#D9D9D9] pb-4'>
            Story Rating
          </div>
        </>
      )}
      {isCardsLoaded && (
        <div className='py-4'>
          <CommentsList storyId={id}/>
        </div>
      )}
    </div>
  )
}
