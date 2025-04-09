import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaHeart, FaRegHeart } from 'react-icons/fa';

import { getTopicTags } from '../../api/base.api';
import { deleteLike, likeSomething } from '../../api/blog.api';


export function TopicsSelect({ isAuthenticated, activeSpace }) {
  const [topicTags, setTopicTags] = useState([]);
  const [selectedTopicTag, setSelectedTopicTag] = useState(null);
  const [error, setError] = useState(null);
  const sliderRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    loadTopicTags();
  }, []);

  async function loadTopicTags() {
    try {
      const spaceId = activeSpace?.id ?? null;
      const res = await getTopicTags(spaceId);
      const shuffledResults = res.data.results.sort(() => Math.random() - 0.5);
      setTopicTags(shuffledResults);
      if (shuffledResults.length > 0) {
        setSelectedTopicTag(shuffledResults[0]);
      }
    } catch (error) {
      setError(error);
    }
  }

  const updateTopicLikeState = (topicId, likeState) => {
    setTopicTags(currentTopicTags => currentTopicTags.map(topicTag => ({
      ...topicTag,
      topics: topicTag.topics.map(topic => {
        if (topic.id === topicId) {
          return { ...topic, user_has_liked: likeState };
        }
        return topic;
      })
    })));
  };

  const handleLikeClick = async (topicId, userHasLiked) => {
    try {
      if (typeof userHasLiked === 'number') {
        await deleteLike(userHasLiked);
        updateTopicLikeState(topicId, false);
      } else {
        const data = {
          liked: true,
          content_type: topicTags[0].topic_content_type_id,
          object_id: topicId,
          is_active: true
        };
        const response = await likeSomething(data);
        updateTopicLikeState(topicId, response.data.id);
      }
    } catch (error) {
      console.error("Error processing like/unlike:", error);
    }
  };

  const settings = {
    dots: false,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 2300,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 1780,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        }
      },
      {
        breakpoint: 1320,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        }
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  const setSliderRef = (id, el) => {
    if (el) {
      sliderRefs.current[id] = el;
    }
  };
  const goToNext = (id) => {
    if (sliderRefs.current[id] && sliderRefs.current[id].slickNext) {
      sliderRefs.current[id].slickNext();
    }
  };
  const goToPrevious = (id) => {
    if (sliderRefs.current[id] && sliderRefs.current[id].slickPrev) {
      sliderRefs.current[id].slickPrev();
    }
  };

  return (
    <div>
      {selectedTopicTag && (
        <div key={selectedTopicTag.id} className='py-4 rounded-xl px-3' style={{
          backgroundColor: `${selectedTopicTag.color || "#3DB1FF"}66`,
        }}>
          <div className='grid grid-cols-6 md:grid-cols-8 xl:grid-cols-12 pt-2 pb-1'>
            <div className='flex items-center' style={{ "--hover-color": selectedTopicTag.color }}>
              <button className='bg-white p-4 rounded-full text-gray-700 hover:bg-[var(--hover-color)] hover:text-white'
                onClick={() => goToPrevious(selectedTopicTag.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className='col-span-4 md:col-span-6 xl:col-span-10'>
              <Slider ref={el => setSliderRef(selectedTopicTag.id, el)} {...settings} className='z-0'>
                {selectedTopicTag.topics.map(topic => (
                  <div key={topic.id}>
                    <div className="flex flex-col justify-between p-4 rounded-lg bg-white
                  shadow-md h-[15rem] z-0 my-2 border-[6px] border-transparent
                   hover:border-[var(--hover-color)] cursor-pointer max-w-[240px] mx-auto" onClick={(e) => {
                        navigate(`topic/${topic.slug}`);
                      }} style={{ "--hover-color": selectedTopicTag.color }}>
                      {topic.image && <div className='flex justify-center'><img src={topic.image} alt={topic.title} className='w-full h-20 rounded-lg' /></div>}
                      <div className={topic.image ? "line-clamp-5 text-center overflow-hidden text-gray-500 py-1" : "line-clamp-8 text-center overflow-hidden text-gray-500 py-1"}>
                        {topic.title}
                        <div className='text-center font-semibold text-gray-500 text-sm pt-2'>
                          Total stories: {topic.story_count}
                        </div>
                      </div>
                      {isAuthenticated && (<div className='flex justify-center pt-2 pb-1' >
                        {topic.user_has_liked ? (
                          <FaHeart
                            className='text-gray-500 text-xl'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeClick(topic.id, topic.user_has_liked);
                            }}
                          />
                        ) : (
                          <FaRegHeart
                            className='text-gray-500 text-xl'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeClick(topic.id, false);
                            }}
                          />
                        )}
                      </div>)}
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
            <div id="boton_derecha" className='text-end flex items-center justify-end' style={{ "--hover-color": selectedTopicTag.color }}>
              <button className='bg-white p-4 rounded-full text-gray-700 hover:bg-[var(--hover-color)] hover:text-white'
                onClick={() => goToNext(selectedTopicTag.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          <div className={`font-semibold  text-end`}>
            <span className='text-sm md:text-base' style={{ color: selectedTopicTag.color || "#3DB1FF" }}>
              [Topics: {selectedTopicTag.topic_count}]
            </span>
          </div>
          <div className='text-center text-lg md:text-xl xl:text-2xl font-semibold border-b-4 pb-4'
            style={{ color: selectedTopicTag.color || "#3DB1FF", borderBottomColor: selectedTopicTag.color || "#3DB1FF" }}>
            {selectedTopicTag.name}
          </div>
          <div className='pt-3 grid grid-cols-5 justify-center items-center text-center'
            style={{
              "--hover-color": `${selectedTopicTag?.color || "#3DB1FF"}66`,
              "--bg-color": `${selectedTopicTag?.color || "#3DB1FF"}`,
              "--text-color": selectedTopicTag?.color || "#FFFFFF",
            }}>
            {topicTags.map((tag, index) => {
              const isSelected = selectedTopicTag?.id === tag.id;
              return (
                <div
                  key={tag.id}
                  className={`p-2 truncate cursor-pointer
                    ${isSelected ? "bg-[var(--hover-color)]" : "bg-[var(--bg-color)] text-white"} 
                    hover:bg-[var(--hover-color)]
                    ${index === 0 ? "rounded-l-lg" : index === topicTags.length - 1 ? "rounded-r-lg" : ""}`
                  }
                  style={isSelected ? { color: selectedTopicTag?.color } : {}}
                  onClick={() => setSelectedTopicTag(tag)}
                >
                  {tag.name}
                </div>
              );
            })}
          </div>
        </div>
      )}</div>
  )
}
