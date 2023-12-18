import React, { useEffect, useState } from 'react'
import { getStoriesByTopic } from '../../api/blog.api';
import { getTopicsByCategory } from '../../api/base.api';
import { FaAngleDown, FaRegSquare } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';


export function StoriesList({ topicId, categoryId }) {
  const [stories, setStories] = useState([]);
  const [topics, setTopics] = useState([]);
  const [error, setError] = useState(null);
  const [selectedButton, setSelectedButton] = useState('Stories');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadStories();
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(1);
    loadStories();
  }, [topicId, selectedButton]);

  async function loadStories() {
    try {
      const ordering = selectedButton === 'Latest' ? '-created_time' : null;
      const res = await getStoriesByTopic(topicId, currentPage, ordering);
      setStories(prevStories => currentPage === 1 ? res.data.results : [...prevStories, ...res.data.results]);
      setHasMore(!!res.data.next);
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

  const handleTopicClick = (topicId) => {
    navigate(`/topic/${topicId}`);
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
      <div className='grid grid-cols-10 pb-3'>
        <div className='col-span-7 flex'>
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
        <div className='flex justify-center items-center text-[0.55rem] sm:text-[0.85rem] md:text-base'>Replies <span><FaAngleDown /></span></div>
        <div className='flex justify-center items-center text-[0.55rem] sm:text-[0.85rem] md:text-base'>Views <span><FaAngleDown /></span></div>
        <div className='flex justify-center items-center text-[0.55rem] sm:text-[0.85rem] md:text-base'>Likes <span><FaAngleDown /></span></div>
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
              <Link to={`/story/${story.id}`} className='col-span-7 bg-gray-50 p-3 rounded-lg'>
                <div className='font-bold text-black text-xl truncate'>{story.title}</div>
                <div className='flex justify-between'>
                  <div className='text-sm truncate pe-2'>{story.subtitle}</div>
                  <div className='flex'>
                    {story.card_colors.map((color, colorIndex) => (
                      <div key={colorIndex} className="pe-1" style={{ color: color || "#3DB1FF" }}>
                        <FaRegSquare />
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
              <div className='text-center text-[#3DB1FF] self-center'>{story.comments_count}</div>
              <div className='text-center text-[#3DB1FF] self-center'>{story.views_count}</div>
              <div className='text-center text-[#3DB1FF] self-center'>{story.likes_count}</div>
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
            onClick={() => handleTopicClick(topic.id)}
            className='text-[#818282] p-3 md:p-4 bg-gray-200 rounded-lg border mr-3 mb-3'>
            {truncateText(topic.title)}
          </button>
        ))}
      </div>
    </div>
  )
}
