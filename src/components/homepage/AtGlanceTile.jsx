import React, { useEffect, useState } from 'react'
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import { getStories } from '../../api/blog.api';
import { StoryRow } from '../topics/StoryRow';


export function AtGlanceTile({ isAuthenticated }) {
  const [stories, setStories] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(true);


  useEffect(() => {
    loadStories();
  }, []);

  async function loadStories() {
    try {
      const res = await getStories(1, 10, "-views_count");
      setStories(res.data.results)

    } catch (error) {
      setError(error);
    }
  }
  return (
    <div className='bg-[#DEE5E8] rounded-xl p-3'>
      <div className='flex items-center' onClick={() => setIsOpen(!isOpen)}>
        <div className='flex-grow pe-3 cursor-pointer'>
          <div className='text-[#75929F] font-bold md:text-xl xl:text-2xl border-b-2 border-[#75929F]'>
            At glance
          </div>
          <div className='text-end text-[#75929F] text-sm pb-1'>
            [Top 10 weekly stories]
          </div>
        </div>
        <div>
          <div className="text-[#75929F] text-2xl cursor-pointer">
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className='max-h-[500px] overflow-auto pe-2'>
          {stories.map((story, index) => (
            <StoryRow story={story} key={index} isAuthenticated={isAuthenticated} />
          ))}
        </div>
      )}
    </div>
  )
}
