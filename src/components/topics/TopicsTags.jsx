import React, { useEffect, useRef, useState } from 'react'
import { getTopicTags } from '../../api/base.api';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaHeart, FaRegHeart } from 'react-icons/fa';


export function TopicTags() {
  const [topicTags, setTopicTags] = useState([]);
  const [error, setError] = useState(null);
  const sliderRefs = useRef({});

  useEffect(() => {
    loadTopicTags();
  }, []);

  async function loadTopicTags() {
    try {
      const res = await getTopicTags();
      setTopicTags(res.data.results);
      console.log(res.data.results);
    } catch (error) {
      setError(error);
    }
  }
  const settings = {
    dots: false,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 8,
    responsive: [
      {
        breakpoint: 1780,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
        }
      },
      {
        breakpoint: 1536,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
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
      <div className='text-4xl font-extrabold pb-4 '>"Heading"...</div>
      <div className='text-2xl '>"Text block"...</div>
      {topicTags.map(topictag => (
        <div key={topictag.id} className='py-4'>
          <div className={`text-3xl font-semibold py-3 border-b-4`} style={{ borderBottomColor: topictag.color || "#FFC700" }}>{topictag.name}</div>
          <div className='grid grid-cols-6 md:grid-cols-12 py-4'>
            <div className='flex items-center'>
              <button className='bg-white p-4 rounded-full text-gray-700 hover:bg-gray-800 hover:text-white' onClick={() => goToPrevious(topictag.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
            <div className='col-span-4 md:col-span-10'>
              <Slider ref={el => setSliderRef(topictag.id, el)} {...settings} className='z-0 px-4'>
                {topictag.topics.map(topic => (
                  <div key={topic.id} className="px-6 py-4 sm:p-4 rounded-lg bg-white shadow-md h-[16.5rem] z-0 my-2 border-[6px] border-transparent hover:border-yellow-opacity">
                    <div className='flex justify-center'>
                      {topic.image && <img src={topic.image} alt={topic.title} className='w-full h-20 rounded-lg' />}
                    </div>
                    <div className="pt-3 text-center overflow-hidden h-32 text-gray-500">{topic.title}</div>
                    <div className='flex justify-center py-2'>
                      <FaRegHeart className='text-gray-500 text-xl' />
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
