import React from 'react'
import { FaBook, FaUsers } from 'react-icons/fa'
import { Link } from 'react-router-dom'


export function SpaceInfoBox({ spaceInfo }) {
  return (
    <div className='bg-white rounded px-3 py-4 items-center border border-gray-100 mb-3'>
      <div className='font-bold pb-3'>{spaceInfo.name}</div>
      <div className='pb-4 text-gray-500 text-sm'>{spaceInfo.description}</div>
      <div className='flex flex-col md:flex-row justify-between text-gray-500 space-y-2 md:space-y-0'>
        <div className='flex items-center text-sm'>
          <FaUsers /> <span className='ps-2'>{spaceInfo.members_count} | active users are present on this space</span>
        </div>
        <div className='flex items-center text-sm'>
          <FaBook /> <span className='ps-2'>{spaceInfo.stories_count} | stories are present on this space</span>
        </div>
        <div className='flex items-center text-sm'>
          <FaBook /> <Link to="/" className='ps-2 text-[#3DB1FF] underline'>Most viewed story</Link>
        </div>
        <div className='flex items-center text-sm'>
          <FaBook /> <Link to="/" className='ps-2 text-[#3DB1FF] underline'>Most commented story</Link>
        </div>
      </div>
    </div>
  )
}

