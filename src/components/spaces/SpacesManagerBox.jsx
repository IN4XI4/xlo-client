import React from 'react'

export function SpacesManagerBox() {
  return (
    <div className='bg-white rounded px-3 py-4 items-center border border-gray-100 mb-3'>
      <div className='font-bold pb-3'>Spaces manager</div>
      <div className='flex'>
        <div className='flex flex-col-reverse md:flex-row'>
          <div>New Space</div>
          <div>Mixelo Space</div>
        </div>
        <div className='flex-grow'></div>
      </div>
    </div>
  )
}
