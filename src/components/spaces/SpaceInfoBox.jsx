import React from 'react'
import { FaBook, FaUsers } from 'react-icons/fa'
import { Link } from 'react-router-dom'


export function SpaceInfoBox({ spaceInfo }) {
  const isDefaultSpace = !spaceInfo.id;
  const defaultName = 'Mixelo Space';
  const defaultDescription = 'This is Mixelo’s main public space that all users share.';

  return (
    <div className='bg-white rounded px-3 py-4 items-center border border-gray-100 mb-3'>
      <div className='font-bold pb-3'>{isDefaultSpace ? defaultName : spaceInfo.name}</div>
      <div className='text-gray-500 text-sm border-b-2 min-h-[70px]'>
        {isDefaultSpace ? defaultDescription : spaceInfo.description}
      </div>
      <div className='flex flex-col md:flex-row justify-evenly text-gray-500 space-y-2 md:space-y-0 pt-3'>
        {!isDefaultSpace && (
          <>
            <div className='flex items-center text-sm'>
              <FaUsers />
              <span className='ps-2'>{spaceInfo.members_count} | active users are present on this space</span>
            </div>
            <div className='flex items-center text-sm'>
              <FaBook />
              <span className='ps-2'>{spaceInfo.stories_count} | stories are present on this space</span>
            </div>
          </>
        )}
        {(spaceInfo.is_member || isDefaultSpace) && (
          <>
            <div className='flex items-center text-sm'>
              <FaBook />
              <Link to="#" className='ps-2 text-[#3DB1FF]'>Most consumed stories</Link>
            </div>
            <div className='flex items-center text-sm'>
              <FaBook />
              <Link to="#" className='ps-2 text-[#3DB1FF]'>Most commented stories</Link>
            </div>
            <div className='flex items-center text-sm'>
              <FaUsers />
              <Link to="#" className='ps-2 text-[#3DB1FF]'>Most active members</Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

