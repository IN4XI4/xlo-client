import React, { useEffect, useState } from 'react'
import { FaRegBookmark, FaRegTimesCircle } from 'react-icons/fa'
import { HiOutlineArrowLeftCircle, HiOutlineArrowRightCircle } from "react-icons/hi2";
import { getMyRecallCards } from '../api/blog.api';
import { useLocation, useNavigate } from 'react-router-dom';


export function RecallsPage() {
  const [recallCards, setRecallCards] = useState([]);
  const [error, setError] = useState(null);
  const [isCardsLoaded, setIsCardsLoaded] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadRecallCards();
  }, []);

  async function loadRecallCards() {
    try {
      const res = await getMyRecallCards();
      console.log(res.data);
      setRecallCards(res.data);
      setIsCardsLoaded(true);
    } catch (error) {
      setError(error);
    }
  }

  const handleBackClick = () => {
    if (location.state?.fromNavigation) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="pt-20 md:pt-28 px-4 md:px-16 lg:px-32 xl:px-44">
      {!isCardsLoaded ? (
        <div>Loading...</div>
      ) : recallCards.length === 0 ? (
        <div>You have no recall cards.</div>
      ) : (
        <div>{recallCards[currentCardIndex].card.title}</div>
      )}
      <div className="fixed inset-x-0 bottom-0 text-white text-center z-50">
        <div className='bg-[#0098FF] text-end px-4 text-sm'>
          Vous êtes en mode “Rappel”
        </div>
        <div className='bg-[#3DB1FF] px-4 flex py-1'>
          <div className='flex-none flex items-center'>
            <FaRegBookmark />
          </div>
          <div className='flex-grow items-center flex justify-center space-x-4 '>
            <div>
              <HiOutlineArrowLeftCircle className='text-4xl' />
            </div>
            <div>
              <HiOutlineArrowRightCircle className='text-4xl' />
            </div>
          </div>
          <div className='flex-none  flex items-center'>
            <FaRegTimesCircle className='text-xl cursor-pointer' onClick={handleBackClick} />
          </div>
        </div>
      </div>
    </div>
  )
}
