import React, { useState } from 'react'
import { FaFileLines } from "react-icons/fa6";
import { FaFolderOpen } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';


export function SelectRecallsModal({ onClose }) {
  const [isOpen, setIsOpen] = useState(true);
  const [isBlocksPractice, setIsBlocksPractice] = useState(false);
  const navigate = useNavigate();


  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  const handleRecallsClick = () => {
    setIsOpen(false);
    onClose();
    navigate('/recall-cards/', { state: { fromNavigation: true } });
  };

  const handleBlocksPracticeClick = () => {
    setIsBlocksPractice(true);
  };

  const handleFocusedModeClick = () => {
    setIsOpen(false);
    onClose();
    navigate('/recall-blocks-focused/', { state: { fromNavigation: true } });
  };

  const handleSparkModeClick = () => {
    setIsOpen(false);
    onClose();
    navigate('/recall-blocks-sparked/', { state: { fromNavigation: true } });
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="mt-24 mx-auto border w-80 md:w-96 shadow-lg rounded-md bg-white p-1" onClick={handleModalClick}>
        <div className="flex flex-col text-center">
          {!isBlocksPractice ? (
            <>
              <div className='bg-[#3DB1FF] py-14 rounded-md text-[#B8E3FF] text-2xl font-semibold flex 
          justify-center items-center mb-2 cursor-pointer' onClick={handleBlocksPracticeClick}>
                <div className='pe-2'>
                  <FaFileLines />
                </div>
                <div>
                  BLOCKS PRACTICE
                </div>
              </div>
              <div className='bg-[#BD7DF4] py-14 rounded-md text-[#B8E3FF] text-2xl font-semibold flex
          justify-center items-center cursor-pointer' onClick={handleRecallsClick}>
                <div className='pe-2'>
                  <FaFolderOpen />
                </div>
                <div>
                  CARDS PRACTICE
                </div>
              </div>
            </>
          ) : (
            <>
              <div className='bg-[#B8E3FF] py-14 rounded-md text-[#3DB1FF] text-2xl font-semibold 
              justify-center items-center mb-2 cursor-pointer' onClick={handleFocusedModeClick}>
                  FOCUSED MODE
              </div>
              <div className='bg-[#A9DFBF] py-14 rounded-md text-[#30B299] text-2xl font-semibold flex
              justify-center items-center cursor-pointer' onClick={handleSparkModeClick}>
                  SPARKED MODE
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  )
}
