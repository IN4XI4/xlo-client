import React from 'react'
import { FaCircleInfo } from "react-icons/fa6";

export function Details() {
  return (
    <div className='bg-white rounded border p-3 shadow'>
      <div className='font-semibold text-lg pb-3 md:pb-4 flex items-center'>
        My avatar
        <span className='ps-2'><FaCircleInfo className='text-sm text-gray-300' /></span>
      </div>
      <div className='bg-gray-100 py-3 md:py-6 px-2 text-xl md:text-2xl rounded'>
        Coming soon!
      </div>
    </div>
  )
}
