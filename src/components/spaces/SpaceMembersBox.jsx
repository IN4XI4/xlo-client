import React from 'react'
import { FaUsers } from 'react-icons/fa'


export function SpaceMembersBox() {
  return (
    <div className='bg-white rounded px-3 py-4 items-center border border-gray-100 mb-3'>
      <div className='font-bold'>Space members</div>
      <div className='pb-3 text-gray-500 text-sm hidden md:block'>
        Here you will find all users who belong to this space
      </div>
      <div className='flex justify-end'>
        <button className="px-3 py-2 rounded-lg flex items-center w-44 justify-center bg-[#3DB1FF] text-white">
          <span><FaUsers /></span> <span className='ps-2'>Space members</span>
        </button>
      </div>
    </div>
  )
}
