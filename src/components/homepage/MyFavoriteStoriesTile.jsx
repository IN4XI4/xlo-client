import React, { useEffect, useState } from 'react';
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import { getLikedStories } from '../../api/blog.api';
import { StoryRow } from '../topics/StoryRow';


export function MyFavoriteStoriesTile({ activeSpace }) {
  const [stories, setStories] = useState([]);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(true);


  useEffect(() => {
    loadStories();
  }, []);

  async function loadStories() {
    try {
      const spaceId = activeSpace?.id ?? null;
      const res = await getLikedStories(1, 10, "-created_time", spaceId);
      setStories(res.data.results)
      console.log("res", res.data.results);

    } catch (error) {
      setError(error);
    }
  }

  return (
    <div className='bg-[#C9B9B7] rounded-xl p-3'>
      <div className='flex items-center' onClick={() => setIsOpen(!isOpen)}>
        <div className='flex-grow pe-3 cursor-pointer'>
          <div className='text-[#98706A] font-bold md:text-xl xl:text-2xl border-b-2 border-[#98706A]'>
            My favorite stories
          </div>
          <div className='text-end text-[#98706A] text-sm pb-1'>
            [Here is your collection of liked stories]
          </div>
        </div>
        <div>
          <div className="text-[#98706A] text-xl cursor-pointer">
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>
        </div>
      </div>
      {isOpen && (
        <div className='max-h-[500px] overflow-auto pe-2'>
          {stories.length === 0 ? (
            <div className="text-[#98706A] text-center p-3">
              You haven't liked any stories yet.
            </div>
          ) : (
            stories.map((story) => (
              <StoryRow story={story} key={story.id} />
            ))
          )}
        </div>
      )}
    </div>
  )
}
