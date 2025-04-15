import React, { useState } from 'react'
import { FaEye, FaHeart } from 'react-icons/fa';
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import { PiTextAlignJustifyFill } from "react-icons/pi";

export function MyActivitiesTile({ activeDays, userData = null, isAuthenticated = null }) {
  const [isOpen, setIsOpen] = useState(true);
  const formattedDays = activeDays < 10 ? `0${activeDays}` : activeDays;
  const currentDate = new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  return (
    <div className='flex flex-col'>
      <div className={`bg-[#95CAE8] rounded-xl p-3 mb-3 sm:mb-0 ${isOpen ? "flex-grow flex flex-col" : ""}`}>
        <div className='flex items-center' onClick={() => setIsOpen(!isOpen)}>
          <div className='flex-grow pe-3 cursor-pointer'>
            <div className='text-[#0090BD] font-bold md:text-xl xl:text-2xl border-b-2 border-[#0090BD]'>
              My activities
            </div>
            <div className='text-end text-[#0090BD] text-sm pb-1'>
              [{currentDate}]
            </div>
          </div>
          <div>
            <div className="text-[#0090BD] text-xl cursor-pointer">
              {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
        </div>
        {isOpen && (
          <div className='flex-grow flex flex-col'>
            {isAuthenticated ? (
              <>
                <div className='flex items-end py-3 md:pb-3'>
                  <div className='text-6xl font-semiboldbold pe-1'>{formattedDays}</div>
                  <div className='py-0 text-sm pb-1'>
                    <div className='py-0'>Active</div>
                    <div className='py-0'>days</div>
                  </div>
                </div>
                {userData && (
                  <div className='mx-8 px-4 py-1 grid grid-cols-2 mb-2 rounded border bg-white '>
                    <div>
                      <div className='flex items-center'>
                        <FaEye className='text-[#3DB1FF]' /> <div className='ps-2'>Views</div>
                      </div>
                      <div className='flex items-center'>
                        <FaHeart className='text-[#3DB1FF]' /> <div className='ps-2'>Likes</div>
                      </div>
                      <div className='flex items-center'>
                        <PiTextAlignJustifyFill className='text-[#3DB1FF]' /> <div className='ps-2'>Stories</div>
                      </div>
                    </div>
                    <div className='text-end font-semibold'>
                      <div>{userData.views_count}</div>
                      <div>{userData.likes_count}</div>
                      <div>{userData.story_count}</div>
                    </div>
                  </div>
                )}

                <div className="flex-grow"></div>
                <div className='flex justify-end items-end pt-1'>
                  <div className='bg-[#0090BD] px-4 py-1 rounded-lg text-white cursor-pointer'>
                    SEE MY ACTIVITIES
                  </div>
                </div>
              </>
            ) : (
              <div className='text-center text-[#0090BD] py-4 font-bold'>
                Login to watch full content
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  )
}
