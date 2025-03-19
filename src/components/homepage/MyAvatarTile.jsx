import React, { useState } from 'react'
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';


export function MyAvatarTile() {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className='flex flex-col'>
      <div className={`bg-[#B8E3FF] rounded-xl p-3 mb-3 sm:mb-0 ${isOpen ? "flex-grow flex flex-col" : ""}`}>
        <div className='flex items-center' onClick={() => setIsOpen(!isOpen)}>
          <div className='flex-grow pe-3 cursor-pointer'>
            <div className='text-[#3DB1FF] font-bold md:text-xl xl:text-2xl border-b-2 border-[#3DB1FF]'>
              My avatar
            </div>
            <div className='text-end text-[#3DB1FF] text-sm pb-1'>
            [Follow the progress of your character]
            </div>
          </div>
          <div>
            <div className="text-[#3DB1FF] text-xl cursor-pointer">
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
              <div className='bg-[#3DB1FF] px-4 py-1 rounded-lg text-white cursor-pointer'>
                SEE MY AVATAR
              </div>
            </div>
          </div>)}
      </div>
    </div>
  )
}
