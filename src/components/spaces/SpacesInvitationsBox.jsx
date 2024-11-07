import React, { useEffect, useRef, useState } from 'react'
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";

import { getSpaceInvitations } from '../../api/spaces.api';
import { RocketIcon } from '../illustrations/icons/RocketIcon';
import { SpaceInvitationModal } from './SpaceInvitationModal';

export function SpacesInvitationsBox({ onActionComplete }) {
  const sliderRef = useRef(null);
  const [spaceInvitations, setSpaceInvitations] = useState([]);
  const [isSpaceInvitationsLoaded, setIsSpaceInvitationsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvitation, setSelectedInvitation] = useState(null);

  useEffect(() => {
    loadSpaceInvitations();
  }, []);

  async function loadSpaceInvitations() {
    try {
      const response = await getSpaceInvitations();
      console.log(response.data);
      setIsSpaceInvitationsLoaded(true);
      setSpaceInvitations(response.data);
    } catch (error) {
      console.error("Error fetching space invitations:", error);
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
    slidesToShow: 7,
    slidesToScroll: 7,
    responsive: [
      {
        breakpoint: 1780,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
        }
      },
      {
        breakpoint: 1320,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3
        }
      }
    ]
  };

  const openInvitationModal = (invitation) => {
    setSelectedInvitation(invitation);
    setShowModal(true);
  };

  const closeInvitationModal = () => {
    setShowModal(false);
    setSelectedInvitation(null);
  };

  const handleActionComplete = (message, color) => {
    if (onActionComplete) onActionComplete(message, color);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    loadSpaceInvitations();
    closeInvitationModal();
  };

  return (
    <div className='bg-white rounded px-3 py-4 items-center border border-gray-100 mb-3'>
      <div className='font-bold pb-3'>Space invitations</div>
      <div className='flex-grow grid grid-cols-12 justify-center'>
        <div className='hidden md:col-span-1 md:flex items-center justify-center'>
          <div className='p-2 bg-[#3DB1FF] text-white rounded-full text-lg cursor-pointer'
            onClick={goToPrevious}>
            <GrFormPrevious />
          </div>
        </div>
        {spaceInvitations.length > 0 ? (
          <Slider ref={sliderRef} {...settings} className='col-span-12 md:col-span-10 mb-2'>
            {spaceInvitations.map(invitation => (
              <div key={invitation.id} className='flex justify-center items-center'>
                <div className='flex justify-center py-2'>
                  <div className='cursor-pointer' onClick={() => openInvitationModal(invitation)}>
                    {invitation.space_image ? (
                      <img src={invitation.space_image} alt="Profile"
                        className="w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] rounded-full outline-dashed outline-offset-1 
                      outline-gray-500"
                        style={{ borderColor: invitation.space_color }} />
                    ) : (
                      <RocketIcon color={invitation.space_color}
                        className="w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] rounded-full outline-dashed outline-offset-1 
                        outline-gray-500" />
                    )}
                  </div>
                </div>
                <div className='flex justify-center font-bold text-sm md:text-base cursor-pointer text-center'>
                  {invitation.space_name.length > 40 ? `${invitation.space_name.slice(0, 37)}...` : invitation.space_name}
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <div className='col-span-12 md:col-span-10 flex justify-center items-center text-gray-500 py-6'>
            No invitations yet.</div>
        )}
        <div className='hidden md:col-span-1 md:flex items-center justify-center'>
          <div className='p-2 bg-[#3DB1FF] text-white rounded-full text-lg cursor-pointer'
            onClick={goToNext}>
            <GrFormNext />
          </div>
        </div>
      </div>
      {showModal && selectedInvitation && (
        <SpaceInvitationModal
          invitationData={selectedInvitation}
          onCancel={closeInvitationModal}
          onActionComplete={handleActionComplete} />
      )}
    </div>
  )
}
