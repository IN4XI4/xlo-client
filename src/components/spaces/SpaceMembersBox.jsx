import React from 'react'
import { Link } from 'react-router-dom'
import { FaUser, FaUsers } from 'react-icons/fa'


export function SpaceMembersBox({ spaceInfo }) {

  const isButtonDisabled = !spaceInfo?.id || !spaceInfo?.is_member;

  let userRole = 'not a member';
  let roleColorClass = 'text-gray-500';
  if (spaceInfo?.is_owner) {
    userRole = 'the space owner';
    roleColorClass = 'text-[#9B51E0]';
  } else if (spaceInfo?.is_admin) {
    userRole = 'an admin member';
    roleColorClass = 'text-[#5B0FFE]';
  } else if (spaceInfo?.is_member) {
    userRole = 'a standard member';
    roleColorClass = 'text-[#3DB1FF]';
  }

  return (
    <div className='bg-white rounded px-3 py-4 items-center border border-gray-100 mb-3'>
      <div className='font-bold'>Space members</div>
      <div className='pb-3 text-gray-500 text-sm hidden md:block'>
        Here you will find all users who belong to this space
      </div>
      <div className='flex justify-between items-center'>
        <div className={`flex text-sm items-center ${roleColorClass}`}>
          {isButtonDisabled ? (<></>) : (
            <>
              <span className='pe-2'><FaUser /></span>
              <div>
                <span>You are: </span>
                <span className='font-semibold ps-2'>[{userRole}]</span>
              </div>
            </>)}
        </div>
        <Link to={isButtonDisabled ? '#' : `/spaces/${spaceInfo.slug}/members`}>
          <button
            className={`px-2 md:px-3 py-2 rounded-full md:rounded-lg flex items-center md:w-44
              text-white justify-center 
              ${isButtonDisabled ? 'bg-[#BEE1F8] cursor-not-allowed' : 'bg-[#3DB1FF] '
              }`}
            disabled={isButtonDisabled}>
            <span><FaUsers /></span>
            <span className='ps-2 hidden md:block'>Space members</span>
          </button>
        </Link>
      </div>
    </div>
  )
}
