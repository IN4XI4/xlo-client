import React, { useState } from 'react'
import { FaArrowRightLong } from "react-icons/fa6";

export function MonsterMentorProfileModal({ image, name, job, profile, color, soft_skill_name, soft_skill_description,
  soft_skill_logo, onClose, isMonster }) {
  const [isOpen, setIsOpen] = useState(true);
  const handleModalClick = (event) => {
    event.stopPropagation();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={onClose}>
      <div id="principal" className="mt-24 mx-auto px-6 pt-4 border w-80 md:w-1/2 lg:w-1/3 2xl:w-1/4 shadow-lg
       rounded-md bg-white mb-6" onClick={handleModalClick}>
        <div id="relativo" className='relative -top-10 md:-top-16'>
          <div className='flex items-end border-b pb-3 '>
            <div className='ps-2'>
              {image ? (
                <img src={image} alt="Mentor" className="h-20 w-20 md:h-24 md:w-24 rounded-full border-2"
                  style={{ borderColor: color }} />
              ) : <div className='p-8 md:p-10 rounded-full bg-gray-300 text-gray-500 border-2'
                style={{ borderColor: color }}>
                <FaUser />
              </div>}
            </div>

            <div className='ps-2 flex flex-col'>
              <span className='font-bold text-base'>
                {name}
              </span>
            </div>
          </div>
          {job && <div className='flex flex-col md:flex-row py-3 text-gray-500 border-b md:items-center'>
            <div className='md:pe-3 font-semibold'>{job}</div>
          </div>}
          <div className={`flex py-3 text-gray-500 text-sm ${isMonster ? 'border-b ' : ''}`}>
            {profile} &nbsp;
          </div>
          {isMonster && (<div>
            <div className='flex py-3 text-gray-500 items-center'>
              {soft_skill_logo && <div className='pe-2'>
                <img src={soft_skill_logo} alt="" className='h-8 w-8' />
              </div>}
              {soft_skill_name}
            </div>
            <div className='flex py-3 text-gray-500 text-sm'>
              {soft_skill_description}
            </div>
            <div className='flex py-2 items-center text-sm space-x-2 text-[#3DB1FF] underline cursor-pointer'>
              <div><FaArrowRightLong /></div>
              <div>Découvrez-en davantage sur cette Soft Skill</div>
            </div>
          </div>)}
        </div>
        <div className="mb-[-1rem] md:mb-[-3rem]">
        </div>
      </div>
    </div>
  )
}
