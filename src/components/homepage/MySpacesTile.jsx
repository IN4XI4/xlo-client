import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';


export function MySpacesTile() {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className='bg-white flex flex-col'>
      <div className={`bg-[#F0DEA4] rounded-xl p-3 mb-3 sm:mb-0  sm:ms-2 ${isOpen ? "flex-grow flex flex-col" : ""}`}>
        <div className='flex items-center' onClick={() => setIsOpen(!isOpen)}>
          <div className='flex-grow pe-3 cursor-pointer'>
            <div className='text-[#D6A400] font-bold md:text-xl xl:text-2xl border-b-2 border-[#D6A400]'>
              My spaces
            </div>
            <div className='text-end text-[#D6A400] text-sm pb-1'>
              [Active a space and explore content]
            </div>
          </div>
          <div>
            <div className="text-[#D6A400] text-xl cursor-pointer">
              {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
        </div>
        {isOpen && (
          <div className='flex-grow flex flex-col'>
            <div className='flex items-end py-3 md:pb-4'>
            </div>
            <div className="flex-grow"></div>
            <div className='flex justify-end items-end pt-1'>
              <div className='bg-[#D6A400] px-4 py-1 rounded-lg text-white cursor-pointer'>
                ENTER TO SPACES
              </div>
            </div>
          </div>)}
      </div>
    </div>
  )
}
