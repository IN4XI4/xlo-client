import React from 'react'
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { CgShapeCircle } from 'react-icons/cg';
import { RiEarthFill } from 'react-icons/ri';
import { IoIosSpeedometer } from 'react-icons/io';

import { flagMap } from '../../globals';


export function StoryRow({ story, isAuthenticated }) {
  return (
    <div className='py-2'>
      <Link to={`/story/${story.slug}`}
        className={`${story.user_has_viewed || !isAuthenticated ? 'bg-[#D5D7DB]' : 'bg-[#FFCE80]'} 
                      p-3 rounded-lg me-1 md:me-0 flex`}>
        {story.image && (
          <div className="hidden md:flex items-center justify-center md:w-24 md:h-20 md:mr-3">
            <img src={story.image} alt={story.title} className="object-cover w-full h-full rounded-lg" />
          </div>
        )}
        <div className='flex-grow overflow-hidden pb-1'>
          <div className='font-bold text-black truncate'>{story.title}</div>
          <div className='text-sm truncate'>{story.subtitle}</div>
          <div className="flex items-center pt-2">
            {story.difficulty_color && story.difficulty_name &&
              <div className='me-4 flex-none'>
                <div
                  className="flex w-auto items-center px-3 rounded-lg text-white text-sm"
                  style={{ backgroundColor: story.difficulty_color }}
                >
                  <IoIosSpeedometer className="me-1" />
                  {story.difficulty_name}
                </div>
              </div>}

            <div className='me-4 flex-grow md:flex-none overflow-hidden'>
              <div className="flex items-center">
                <FaUser className="mr-1" />
                <div className="text-sm truncate">{story.owner_name}</div>
              </div>
            </div>
            <div className='flex-none'>
              <div className="flex items-center pe-1 md:pe-0">
                {flagMap[story.language] ? (
                  <img
                    src={flagMap[story.language]}
                    alt={story.language}
                    className="w-5 h-5 md:mr-1 rounded-lg"
                  />
                ) : (
                  <RiEarthFill className="w-5 h-5 md:mr-1 text-gray-500" />
                )}
                <div className="hidden md:block text-sm truncate">{story.language_name}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center space-y-1 md:justify-center mt-0">
          {story.card_colors.slice(0, 4).map((color, colorIndex) => (
            <div key={colorIndex} className="w-4 h-4" style={{ color: color || "#3DB1FF" }}>
              <CgShapeCircle />
            </div>
          ))}
        </div>
      </Link>
    </div>
  )
}
