import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { CgShapeCircle } from "react-icons/cg";
import { RiEarthFill } from "react-icons/ri";
import { FaAngleDown, FaCommentDots, FaEye, FaThumbsUp, FaUser } from 'react-icons/fa';
import { IoIosSpeedometer } from "react-icons/io";
import { Tooltip } from 'flowbite-react';

import { getStoriesByTopic } from '../../api/blog.api';
import { getTopicsByCategory } from '../../api/base.api';
import { flagMap } from '../../globals';
import { useSpace } from '../../context/SpaceContext';


export function StoriesList({ topicId, categoryId, searchText }) {
  const [stories, setStories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState(null);
  const [selectedButton, setSelectedButton] = useState('Stories');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const { activeSpace } = useSpace();
  const navigate = useNavigate();

  useEffect(() => {
    loadTopics();
  }, []);

  useEffect(() => {
    loadStories(currentPage);
  }, [currentPage]);

  useEffect(() => {
    loadStories(1);
  }, [topicId, selectedButton, searchText]);

  async function loadStories(page) {
    try {
      const ordering = selectedButton === 'Latest' ? '-created_time' : null;
      const spaceId = activeSpace?.id ?? null;
      const res = await getStoriesByTopic(topicId, page, ordering, searchText, spaceId);

      if (page === 1) {
        setStories(res.data.results);
      } else {
        setStories(prevStories => [...prevStories, ...res.data.results]);
      }

      setHasMore(!!res.data.next);
      if (page === 1) {
        setCurrentPage(1);
      }
    } catch (error) {
      setError(error);
      setHasMore(false);
    }
  }

  async function loadTopics() {
    try {
      const res = await getTopicsByCategory(categoryId);
      setTopics(res.data.results);
    } catch (error) {
      setError(error);
    }
  }

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  }

  const handleTopicClick = (topicSlug) => {
    navigate(`/topic/${topicSlug}`);
    window.scrollTo(0, 0);
  };

  const truncateText = (text) => {
    if (text.length > 26) {
      return text.substring(0, 26) + '...';
    }
    return text;
  };

  return (
    <div className='bg-white border rounded p-3 text-gray-500'>
      <div className='grid grid-cols-10 md:grid-cols-11 pb-3'>
        <div className='col-span-9 md:col-span-8 flex'>
          <button className={`mr-3 ${selectedButton === 'Stories' ? '' : 'text-[#3DB1FF] underline'}`}
            onClick={() => handleButtonClick('Stories')}
            disabled={selectedButton === 'Stories'}>
            Stories
          </button>
          <button className={`${selectedButton === 'Latest' ? '' : 'text-[#3DB1FF] underline'}`}
            onClick={() => handleButtonClick('Latest')}
            disabled={selectedButton === 'Latest'} >
            Latest
          </button>
        </div>
        <div className='hidden md:flex justify-center items-center text-[0.8rem] sm:text-[0.85rem] md:text-base'>
          <span className='hidden md:block'>Replies</span>
          <span className='md:hidden'><FaCommentDots /></span>
          <span><FaAngleDown /></span>
        </div>
        <div className='flex justify-center items-center text-[0.8rem] sm:text-[0.85rem] md:text-base'>
          <span className='hidden md:block'>Views</span>
          <span className='md:hidden'><FaEye /></span>
          <span><FaAngleDown /></span>
        </div>
        <div className='hidden md:flex justify-center items-center text-[0.8rem]  sm:text-[0.85rem] md:text-base'>
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
            <div key={index} className='grid grid-cols-10 md:grid-cols-11 py-3'>
              <Link to={`/story/${story.slug}`}
                className={`col-span-9 md:col-span-8 ${story.user_has_viewed ? 'bg-gray-50' : 'bg-[#FFCE80]'} 
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
                        <Tooltip content="Difficulty level">
                          <div
                            className="flex w-auto items-center px-3 rounded-lg text-white text-sm"
                            style={{ backgroundColor: story.difficulty_color }}
                          >
                            <IoIosSpeedometer className="me-1" />
                            {story.difficulty_name}
                          </div>
                        </Tooltip>
                      </div>}

                    <div className='me-4 flex-grow md:flex-none overflow-hidden'>
                      <div className="flex items-center">
                        <Tooltip content="Created by">
                          <FaUser className="mr-1" />
                        </Tooltip>
                        <div className="text-sm truncate">{story.owner_name}</div>
                      </div>
                    </div>
                    <div className='flex-none'>
                      <Tooltip content="Language">
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
                      </Tooltip>
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
              <div className='hidden md:block text-center text-[#3DB1FF] self-center'>{story.comments_count}</div>
              <div className='text-center text-[#3DB1FF] self-center'>{story.views_count}</div>
              <div className='hidden md:block text-center text-[#3DB1FF] self-center'>{story.likes_count}</div>
            </div>
          ))}
        </InfiniteScroll>
      </div>
      {error && <p className='text-red-500'>Error loading stories: {error.message}</p>}
      <div className='flex flex-wrap text-gray-900 py-3 items-center'>
        <div className='mr-3 mb-3 font-bold'>
          There are no other stories to display in this topic.
          <Link to="/" className='text-[#3DB1FF]'> Browse all topics</Link>, or view top topics:
        </div>
        {topics.map((topic, index) => (
          <button
            key={index}
            onClick={() => handleTopicClick(topic.slug)}
            className='text-[#818282] p-3 md:p-4 bg-gray-200 rounded-lg border mr-3 mb-3'>
            {truncateText(topic.title)}
          </button>
        ))}
      </div>
    </div>
  )
}
