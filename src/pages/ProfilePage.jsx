import React from 'react'
import { FaCog, FaRegCircle, FaUser } from 'react-icons/fa'


export function ProfilePage() {
  return (
    <div className="pt-20 md:pt-28 px-4 md:px-16 lg:px-32 xl:px-44">
      <div className='font-bold text-3xl pb-5'>"TITLE" ADMIN PAGE</div>
      <div className='grid grid-cols-1 md:grid-cols-3'>
        <div className=' pe-2'>
          <div className='bg-white rounded p-2 flex items-center border border-gray-100 mb-3'>
            <div className='bg-gray-200 rounded-full border-2 border-[#3DB1FF] flex items-center justify-center h-24 w-24'>
              <FaUser className='text-xl' />
            </div>
            <div className='ps-3'>
              <div className='font-bold'>Name & Last Name</div>
              <div className='pb-3'>example@email.com</div>
              <button className='bg-[#3DB1FF] px-3 py-2 rounded-lg text-white flex items-center'>
                <span><FaCog /></span> <span className='ps-2'>Change picture</span>
              </button>
            </div>
          </div>
          <div className='bg-white rounded p-3 border border-gray-100'>
            <div className='font-bold pb-2'>Select your color profile</div>
            <div className='flex justify-between'>
              <FaRegCircle className='text-[#3DB1FF]' />
              <FaRegCircle className='text-[#16ACDB]' />
              <FaRegCircle className='text-[#66E3E3]' />
              <FaRegCircle className='text-[#30B299]' />
              <FaRegCircle className='text-[#98DF3E]' />
              <FaRegCircle className='text-[#A6E1D5]' />
              <FaRegCircle className='text-[#FFBA0A]' />
              <FaRegCircle className='text-[#FF943D]' />
              <FaRegCircle className='text-[#FB7061]' />
              <FaRegCircle className='text-[#E27739]' />
              <FaRegCircle className='text-[#D85FA8]' />
              <FaRegCircle className='text-[#9B51E0]' />
            </div>
          </div>
        </div>
        <div className='col-span-2'>asd</div>
      </div>
    </div>
  )
}
