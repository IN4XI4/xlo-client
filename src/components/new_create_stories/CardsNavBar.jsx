import React from 'react'
import { HiArrowNarrowLeft, HiArrowNarrowRight } from 'react-icons/hi'
import { FaAngleDown, FaAngleUp } from "react-icons/fa";

export function CardsNavBar({ goToPreviousCard, goToNextCard }) {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div className='fixed bottom-0 left-0 right-0 flex justify-center items-center p-2 z-30'>
      <div className='flex justify-center items-center bg-white shadow-md rounded-full py-3 px-4'>
        <div className='flex items-center p-2 text-[#3DB1FF] bg-white rounded-full cursor-pointer me-4 md:me-6 border'
          onClick={scrollToBottom}>
          <FaAngleDown className='text-lg md:text-xl' />
        </div>
        <div className='flex items-center p-2 text-white bg-[#3DB1FF] rounded-full cursor-pointer me-4 md:me-6'
          onClick={goToPreviousCard}>
          <HiArrowNarrowLeft className='text-lg md:text-xl' />
        </div>
        <div className='flex items-center p-2 text-white bg-[#3DB1FF] rounded-full cursor-pointer me-4 md:me-6'
          onClick={goToNextCard}>
          <HiArrowNarrowRight className='text-lg md:text-xl' />
        </div>
        <div className='flex items-center p-2 text-[#3DB1FF] bg-white rounded-full cursor-pointer border'
          onClick={scrollToTop}>
          <FaAngleUp className='text-lg md:text-xl' />
        </div>
      </div>
    </div>
  )
}
