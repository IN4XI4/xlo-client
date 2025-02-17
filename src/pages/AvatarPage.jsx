import React from 'react'
import { Activities } from '../components/profile/avatar/Activities'
import { Details } from '../components/profile/avatar/Details'
import { Badges } from '../components/profile/avatar/Badges'


export function AvatarPage() {
  return (
    <div className="pt-24 px-4 md:px-16 lg:px-32 xl:px-44">
      <div className='text-3xl font-semibold pb-3'>
        MY JOURNEY
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 mb-3'>
        <div className='md:col-span-2 md:pe-4 space-y-4'>
          <Activities/>
          <Details />
        </div>
        <div className='py-4 md:py-0'>
          <Badges />
        </div>
      </div>
    </div>
  )
}
