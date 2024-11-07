import React, { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Alert } from 'flowbite-react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { HiInformationCircle } from 'react-icons/hi2';

import { getTopicTags } from '../../api/base.api';
import { deleteLike, likeSomething } from '../../api/blog.api';

export function TopicTags() {
  const [topicTags, setTopicTags] = useState([]);
  const [error, setError] = useState(null);
  const sliderRefs = useRef({});
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    loadTopicTags();
  }, []);

  async function loadTopicTags() {
    try {
      const res = await getTopicTags();
      setTopicTags(res.data.results);
    } catch (error) {
      setError(error);
    }
  }

  useEffect(() => {
    if (location.state?.storyDeleted) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        navigate(location.pathname, { replace: true, state: {} });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location]);

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
    slidesToShow: 7,
    slidesToScroll: 7,
    responsive: [
      {
        breakpoint: 1780,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        }
      },
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        }
      },
      {
        breakpoint: 1320,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
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
        breakpoint: 640,
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
      {showSuccessMessage && (
        <Alert color="success" icon={HiInformationCircle} className='mb-4'>
          <span className="font-medium">Story deleted successfully!</span>
        </Alert>
      )}
      <div className='text-4xl font-extrabold pb-4 '>Choisissez une carte</div>
      <div className='text-xl text-gray-500'>Afin de vous offrir la meilleure expérience possible, choisissez parmi l’une des trois catégories [1]; [2]; [3], celle qui correspond à votre besoin en ce moment précis !
      </div>
      <div className='text-xl text-gray-500'>
        Puis, sélectionnez la carte qui reflète le mieux votre état d’esprit.
      </div>
      {topicTags.map(topictag => (
        <div key={topictag.id} className='py-4'>
          <div className={`text-3xl font-semibold py-3 border-b-4`} style={{ borderBottomColor: topictag.color || "#FFC700" }}>{topictag.name} <span className='text-gray-500 text-sm md:text-base'> (Topics: {topictag.topic_count})</span></div>
          <div className='grid grid-cols-6 md:grid-cols-12 py-4'>
            <div className='flex items-center'>
              <button className='bg-white p-4 rounded-full text-gray-700 hover:bg-gray-800 hover:text-white' onClick={() => goToPrevious(topictag.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className='col-span-4 md:col-span-10'>
              <Slider ref={el => setSliderRef(topictag.id, el)} {...settings} className='z-0'>
                {topictag.topics.map(topic => (
                  <div key={topic.id}>
                    <div className="flex flex-col justify-between p-4 rounded-lg bg-white 
                    shadow-md h-[17.5rem] z-0 my-2 border-[6px] border-transparent
                     hover:border-yellow-opacity cursor-pointer" onClick={(e) => {
                        navigate(`topic/${topic.slug}`);
                      }}>
                      {topic.image && <div className='flex justify-center'><img src={topic.image} alt={topic.title} className='w-full h-20 rounded-lg' /></div>}
                      <div className={topic.image ? "line-clamp-5 text-center overflow-hidden text-gray-500 py-1" : "line-clamp-8 text-center overflow-hidden text-gray-500 py-1"}>
                        {topic.title}
                        <div className='text-center text-gray-500 text-sm pt-1'>
                          Total stories: {topic.story_count}
                        </div>
                      </div>

                      <div className='flex justify-center pt-2 pb-1' >
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
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
            <div id="boton_derecha" className='text-end flex items-center justify-end'>
              <button className='bg-white p-4 rounded-full text-gray-700 hover:bg-gray-800 hover:text-white' onClick={() => goToNext(topictag.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
