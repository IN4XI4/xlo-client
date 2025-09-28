import React from 'react'
import { Activities } from '../components/profile/avatar/Activities'
import { Details } from '../components/profile/avatar/Details'
import { Badges } from '../components/profile/avatar/Badges'


export function AvatarPage() {
  return (
    <div className="pt-24 px-4 md:px-12 lg:px-24 xl:px-28 3xl:px-32">
      <div className='text-3xl font-semibold pb-3'>
        MY JOURNEY
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 mb-3'>
        <div className='md:col-span-2 space-y-4'>
          <Details />
          <Activities />
        </div>
        <div className='py-4 md:py-0 md:ps-4'>
          <Badges />
        </div>
      </div>
    </div>
  )
}
