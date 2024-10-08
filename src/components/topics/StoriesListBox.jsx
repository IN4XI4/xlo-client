import React from 'react'
import { Link } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FaAngleDown, FaCommentDots, FaEye, FaLayerGroup, FaTags, FaThumbsUp } from 'react-icons/fa';
import { CgShapeCircle } from "react-icons/cg";
import { FaCalendarAlt } from "react-icons/fa";
import { BiSolidCalendarEdit } from "react-icons/bi";

export function StoriesListBox({ selectedButton, stories, hasMore, handleButtonClick, setCurrentPage, error, isOwner = false }) {
  return (
    <div>
      <div className='grid grid-cols-10 pb-3'>
        <div className='col-span-7 flex'>
          <button className={`mr-3 ${selectedButton === 'Latest' ? '' : 'text-[#3DB1FF] underline'}`}
            onClick={() => handleButtonClick('Latest')}
            disabled={selectedButton === 'Latest'}>
            Latest
          </button>
          <button className={`${selectedButton === 'Oldest' ? '' : 'text-[#3DB1FF] underline'}`}
            onClick={() => handleButtonClick('Oldest')}
            disabled={selectedButton === 'Oldest'} >
            Oldest
          </button>
        </div>
        <div className='flex justify-center items-center text-[0.8rem] sm:text-[0.85rem] md:text-base'>
          <span className='hidden md:block'>Replies</span>
          <span className='md:hidden'><FaCommentDots /></span>
          <span><FaAngleDown /></span>
        </div>
        <div className='flex justify-center items-center text-[0.8rem] sm:text-[0.85rem] md:text-base'>
          <span className='hidden md:block'>Views</span>
          <span className='md:hidden'><FaEye /></span>
          <span><FaAngleDown /></span>
        </div>
        <div className='flex justify-center items-center text-[0.8rem]  sm:text-[0.85rem] md:text-base'>
          <span className='hidden md:block'>Likes</span>
          <span className='md:hidden'><FaThumbsUp /></span>
          <span><FaAngleDown /></span>
        </div>
      </div>
      <div>
        <InfiniteScroll
          dataLength={stories.length}
          next={() => setCurrentPage(prevPage => prevPage + 1)}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p>
              <b>You have seen it all...</b>
            </p>
          }
        >
          {stories.map((story, index) => (
            <div key={index} className='grid grid-cols-10 py-3'>
              <Link to={isOwner ? `/edit-story/${story.id}` : `/story/${story.slug}`}
                className={`col-span-7 ${story.user_has_viewed ? 'bg-gray-50' : 'bg-[#FFCE80]'} p-3 rounded-lg`}>
                <div className='font-bold text-black text-xl truncate'>{story.title}</div>
                <div className='flex justify-between'>
                  <div className='text-sm truncate pe-2'>{story.subtitle}</div>
                  <div className='flex'>
                    {story.card_colors.map((color, colorIndex) => (
                      <div key={colorIndex} className="pe-1" style={{ color: color || "#3DB1FF" }}>
                        <CgShapeCircle />
                      </div>
                    ))}
                  </div>
                </div>
                <div className='flex items-center'>
                  <div className='mr-2'>
                    <FaTags />
                  </div>
                  <div className='truncate'>
                    {story.topic_title}
                  </div>
                </div>
                <div className='flex items-center'>
                  <div className='mr-2'>
                    <FaLayerGroup />
                  </div>
                  <div className='truncate'>
                    {story.tag_name}
                  </div>
                </div>
                {isOwner && <div>
                  <div className='flex items-center'>
                    <div className='mr-2'>
                      <FaCalendarAlt />
                    </div>
                    <div className='truncate'>
                      {new Date(story.created_time).toLocaleString('es-ES')}
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <div className='mr-2'>
                      <BiSolidCalendarEdit className='text-lg' />
                    </div>
                    <div className='truncate'>
                      {new Date(story.edited_time || story.created_time).toLocaleString('es-ES')}
                    </div>
                  </div>
                </div>}

              </Link>
              <div className='text-center text-[#3DB1FF] self-center'>{story.comments_count}</div>
              <div className='text-center text-[#3DB1FF] self-center'>{story.views_count}</div>
              <div className='text-center text-[#3DB1FF] self-center'>{story.likes_count}</div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
      {error && <p className='text-red-500'>Error loading stories: {error.message}</p>}
    </div>
  )
}
