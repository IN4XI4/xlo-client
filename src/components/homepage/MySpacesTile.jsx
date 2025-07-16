import React, { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick';
import { Link } from 'react-router-dom';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';

import { getMySpaces } from '../../api/spaces.api';
import { useSpace } from '../../context/SpaceContext';
import { RocketIcon } from '../illustrations/icons/RocketIcon';


export function MySpacesTile() {
  const [isOpen, setIsOpen] = useState(true);
  const { activeSpace, setActiveSpace } = useSpace();
  const [mySpaces, setMySpaces] = useState([]);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  const roleInfo = {
    owner: { text: '[Owner]', color: 'text-[#9B51E0]' },
    admin: { text: '[Admin]', color: 'text-[#5B0FFE]' },
    member: { text: '[Member]', color: 'text-[#3DB1FF]' }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadMySpaces();
  }, []);

  async function loadMySpaces() {
    try {
      const response = await getMySpaces();
      setMySpaces(response.data);
    } catch (error) {
      setError(error);
    }
  }

  const settings = {
    dots: true,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: []
  };

  return (
    <div className='flex flex-col'>
      <div className={`bg-[#F0DEA4] rounded-xl p-3 mb-3 sm:mb-0  sm:ms-2 ${isOpen ? "flex-grow flex flex-col" : ""}`}>
        <div className='flex items-center' onClick={() => setIsOpen(!isOpen)}>
          <div className='flex-grow pe-3 cursor-pointer'>
            <div className='text-[#D6A400] font-bold md:text-xl xl:text-2xl border-b-2 border-[#D6A400]'>
              My spaces
            </div>
            <div className='text-end text-[#D6A400] text-sm pb-1'>
              [Active a space and explore content]
            </div>
          </div>
          <div>
            <div className="text-[#D6A400] text-xl cursor-pointer">
              {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
        </div>
        {isOpen && (
          <div className='flex-grow flex flex-col justify-between'>
            <div className="pb-6">
              {isLoading ? (
                <div className='flex justify-center items-centero pt-3'>
                  <FaSpinner className="text-[#D6A400] text-4xl animate-spin" />
                </div>
              ) : (mySpaces.length > 0 ? (
                <Slider ref={sliderRef} {...settings} className=''>
                  {mySpaces.map(space => {
                    const role = space.is_owner ? 'owner' : space.is_admin ? 'admin' : 'member';
                    const isActive = space.id == activeSpace?.id
                    return (
                      <div key={space.id} className='flex justify-center items-center '>
                        <div className='flex justify-center py-2' >
                          <Link to={`/spaces/${space.slug}`}
                            className={`bg-[#66E3E3] rounded-full w-16 h-16 flex items-center justify-center
                        cursor-pointer ${isActive ? "ring-4 ring-[#3DB1FF] ring-offset-2 shadow-2xl" : ""}`}>
                            {space.image ? (
                              <img src={space.image} alt="Profile" className="w-16 h-16 rounded-full"
                                style={{ borderColor: space.color_name }} />
                            ) : (
                              <RocketIcon color={space.color_name} className="w-16 h-16" />
                            )}
                          </Link>
                        </div>
                        <Link to={`/spaces/${space.slug}`}
                          className='flex justify-center font-semibold text-sm cursor-pointer text-center truncate'>
                          {space.name}
                        </Link>
                        <div className={`flex justify-center font-semibold text-sm ${roleInfo[role].color}`}>
                          {roleInfo[role].text}
                        </div>
                      </div>
                    )
                  })}
                </Slider>
              ) : (
                <div>No spaces available</div>
              ))}
            </div>
            <div className='flex justify-end items-end pt-1'>
              <Link to={`/spaces`} className='bg-[#D6A400] px-4 py-1 rounded-lg text-white cursor-pointer'
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                ENTER TO SPACES
              </Link>
            </div>
          </div>)}
      </div>
    </div>
  )
}
