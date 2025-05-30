import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowRight, FaPlus } from 'react-icons/fa'
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

import logo from '../../assets/Logo.svg';
import { getMySpaces } from '../../api/spaces.api';
import { useSpace } from '../../context/SpaceContext';
import { RocketIcon } from '../illustrations/icons/RocketIcon';
import { CreateSpaceModal } from './create/CreateSpaceModal';
import { JoinSpaceModal } from './join/JoinSpaceModal';


export function SpacesManagerBox({ onActionComplete, user }) {
  const [mySpaces, setMySpaces] = useState([]);
  const [error, setError] = useState(null);
  const { activeSpace, setActiveSpace } = useSpace();
  const [showCreateSpaceModal, setShowCreateSpaceModal] = useState(false);
  const [showJoinSpaceModal, setShowJoinSpaceModal] = useState(false);
  const sliderRef = useRef(null);
  const isDefaultSpaceActive = !activeSpace?.id;
  const roleInfo = {
    owner: { text: '[Owner]', color: 'text-[#9B51E0]' },
    admin: { text: '[Admin]', color: 'text-[#5B0FFE]' },
    member: { text: '[Member]', color: 'text-[#3DB1FF]' }
  };


  useEffect(() => {
    loadMySpaces();
  }, []);

  useEffect(() => {
    if (onActionComplete) {
      loadMySpaces();
    }
  }, [onActionComplete]);

  async function loadMySpaces() {
    try {
      const response = await getMySpaces();
      setMySpaces(response.data);
    } catch (error) {
      setError(error);
    }
  }

  const goToNext = () => {
    if (sliderRef.current) {
      sliderRef.current.slickNext();
    }
  };

  const goToPrevious = () => {
    if (sliderRef.current) {
      sliderRef.current.slickPrev();
    }
  };

  const settings = {
    dots: true,
    infinite: false,
    arrows: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 6,
    responsive: [
      {
        breakpoint: 1780,
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
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2
        }
      }
    ]
  };

  const openCreateSpaceModal = () => {
    if (user?.is_creator) {
      setShowCreateSpaceModal(true);
    }
  };

  const openJoinSpaceModal = () => {
    setShowJoinSpaceModal(true);
  };

  const closeCreateSpaceModal = () => {
    setShowCreateSpaceModal(false);
  };

  const closeJoinSpaceModal = () => {
    setShowJoinSpaceModal(false);
  };

  return (
    <div className='bg-white rounded px-3 py-4 items-center border border-gray-100 mb-3'>
      <div className='font-bold pb-3'>Spaces manager</div>
      <div className='flex items-center'>
        <div className='flex flex-col-reverse md:flex-row flex-shrink-0 pe-2 md:pe-1 border-r-2'>
          <div className='flex md:flex-col justify-center'>
            <div className='flex items-center md:pb-3 pe-2 md:pe-0'>
              <div className='flex rounded-full items-center p-2 bg-[#3DB1FF] text-white cursor-pointer'
                onClick={() => openCreateSpaceModal()}>
                <FaPlus />
              </div>
              <div className='hidden md:block text-[#3DB1FF] text-sm md:ps-2 cursor-pointer'
                onClick={() => openCreateSpaceModal()}>
                New Space
              </div>
            </div>
            <div className='flex items-center'>
              <div className='flex rounded-full items-center p-2 bg-[#43B29D] text-white cursor-pointer'
                onClick={() => openJoinSpaceModal()}>
                <FaArrowRight />
              </div>
              <div className='hidden md:block text-[#3DB1FF] text-sm md:ps-2 cursor-pointer' onClick={() => openJoinSpaceModal()}>
                Join Space
              </div>
            </div>
          </div>
          <div className='px-3 pb-1 md:pb-0 flex flex-col justify-center items-center text-gray-500'>
            <Link to="/spaces/" className={`rounded-full border-[0.2rem] border-gray-200 w-12 md:w-20 h-12 md:h-20 mb-2
             flex items-center justify-center ${isDefaultSpaceActive ? "ring-4 ring-[#3DBdFF] ring-offset-2 shadow-2xl" : ""}`}>
              <img src={logo} alt="" className='h-6 w-6 md:h-12 md:w-12' />
            </Link>
            <div className='justify-center font-bold text-sm hidden md:block'>
              Mixelo-Space
            </div>
          </div>
        </div>
        <div className='flex-grow grid grid-cols-12 justify-center'>
          <div className='hidden md:col-span-1 md:flex items-center justify-center'>
            <div className='p-2 bg-[#3DB1FF] text-white rounded-full text-lg cursor-pointer'
              onClick={goToPrevious}>
              <GrFormPrevious />
            </div>
          </div>
          {mySpaces.length > 0 ? (
            <Slider ref={sliderRef} {...settings} className='col-span-12 md:col-span-10 mb-2'>
              {mySpaces.map(space => {
                const role = space.is_owner ? 'owner' : space.is_admin ? 'admin' : 'member';
                const isActive = space.id == activeSpace?.id
                return (
                  <div key={space.id} className='flex justify-center items-center'>
                    <div className='flex justify-center py-2'>
                      <Link to={`/spaces/${space.slug}`}
                        className={`bg-[#66E3E3] rounded-full w-16 md:w-20 h-16 md:h-20 flex items-center justify-center
                        cursor-pointer ${isActive ? "ring-4 ring-[#3DB1FF] ring-offset-2 shadow-2xl" : ""}`}>
                        {space.image ? (
                          <img src={space.image} alt="Profile" className="w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] rounded-full"
                            style={{ borderColor: space.color_name }} />
                        ) : (
                          <RocketIcon color={space.color_name} className="w-16 h-16 md:w-[4.5rem] md:h-[4.5rem]" />
                        )}

                      </Link>
                    </div>
                    <Link to={`/spaces/${space.slug}`}
                      className='flex justify-center font-bold text-sm md:text-base cursor-pointer text-center'>
                      {space.name.length > 40 ? `${space.name.slice(0, 37)}...` : space.name}
                    </Link>
                    <div className={`flex justify-center font-semibold text-sm  ${roleInfo[role].color}`}>
                      {roleInfo[role].text}
                    </div>
                  </div>
                )
              })}
            </Slider>
          ) : (
            <div>No spaces available</div>
          )}
          <div className='hidden md:col-span-1 md:flex items-center justify-center'>
            <div className='p-2 bg-[#3DB1FF] text-white rounded-full text-lg cursor-pointer'
              onClick={goToNext}>
              <GrFormNext />
            </div>
          </div>
        </div>
      </div>
      {showCreateSpaceModal && (
        <CreateSpaceModal onCancel={closeCreateSpaceModal} />
      )}
      {showJoinSpaceModal && (
        <JoinSpaceModal
          onCancel={closeJoinSpaceModal}
          user={user}
          onOpenCreate={() => {
            closeJoinSpaceModal();
            openCreateSpaceModal();
          }}
        />
      )}
    </div>
  )
}
