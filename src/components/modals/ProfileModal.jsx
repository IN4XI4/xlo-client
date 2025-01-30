import React, { useEffect, useState } from 'react'
import { FaUser } from 'react-icons/fa';
import { IoMale, IoFemale, IoLogoLinkedin } from "react-icons/io5";
import { BiWorld } from "react-icons/bi";
import { GrMail } from "react-icons/gr";

import ExplorerBadge from '../badges/ExplorerBadge'
import CollaboratorBadge from '../badges/CollaboratorBadge'
import PopularBadge from '../badges/PopularBadge'
import VeteranBadge from '../badges/VeteranBadge'
import StorytellerBadge from '../badges/StorytellerBadge'
import { getUserBadges, getUserModal } from '../../api/users.api';
import { Tooltip } from 'flowbite-react';


const badgeTypeToComponentMap = {
  VETERAN: VeteranBadge,
  STORYTELLER: StorytellerBadge,
  POPULAR: PopularBadge,
  COLLABORATOR: CollaboratorBadge,
  EXPLORER: ExplorerBadge,
};

function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}



export function ProfileModal({ userId, onClose }) {
  const [user, setUser] = useState([]);
  const [error, setError] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [userBadges, setUserBadges] = useState([]);

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const res = await getUserModal(userId);
      setUser(res.data);
      const badgesRes = await getUserBadges(userId);
      setUserBadges(badgesRes.data);
    } catch (error) {
      setError(error);
    }
  }

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-300 bg-opacity-50 overflow-y-auto h-full w-full z-40" onClick={onClose}>
      <div id="principal" className="relative top-32 mx-auto px-6 pt-4 border w-80 md:w-1/2 lg:w-1/3 2xl:w-1/4 shadow-lg rounded-md bg-white" onClick={handleModalClick}>
        <div id="relativo" className='relative -top-10 md:-top-16'>
          <div className='flex items-end border-b pb-3 '>
            <div className='ps-2'>
              {user.profile_picture ? (
                <img src={user.profile_picture} alt="Mentor" className="h-20 w-20 md:h-24 md:w-24 rounded-full border-2"
                  style={{ borderColor: user.profile_color_value }} />
              ) : <div className='p-8 md:p-10 rounded-full bg-gray-300 text-gray-500 border-2'
                style={{ borderColor: user.profile_color_value }}>
                <FaUser />
              </div>}
            </div>
            <div className="hidden md:flex text-gray-500 flex-col items-center ps-1">
              {user.gender === 2 ? <IoFemale size="20" /> : user.gender === 1 ? <IoMale size="20" /> : null}
              <span className='text-sm'>{user.birth_year}</span>
            </div>
            <div className='ps-2 flex flex-col'>
              <span className='font-bold text-base'>
                {user.first_name} {user.last_name}
              </span>
              <span className='text-sm'>
                {user.email}
              </span>
            </div>
          </div>
          <div className='flex py-3 text-gray-500 border-b'>
            <div className='md:hidden pe-2'>
              {user.gender === 2 ? <IoMale size="20" /> : user.gender === 1 ? <IoFemale size="20" /> : null}
            </div>
            <div className='md:hidden pe-2'>
              {user.birth_year}
            </div>
            <div>{user.country} &nbsp;</div>
          </div>
          <div className='flex flex-col md:flex-row py-3 text-gray-500 border-b md:items-center'>
            <div className='md:pe-3 font-semibold'>{user.profession}</div>
            <div className='text-sm'>{user.experience_value} pro. experience</div>
          </div>
          <div className='flex py-3 text-gray-500 border-b'>
            {user.biography} &nbsp;
          </div>
          <div className='flex pt-3 text-gray-500 items-center'>
            <span className='text-xl pe-3'>
              <IoLogoLinkedin />
            </span>
            <span>{user.linkedin_profile}</span>
          </div>
          <div className='flex pt-2 pb-3 text-gray-500 border-b items-center'>
            <span className='text-xl pe-3'>
              <BiWorld />
            </span>
            <span>{user.website}</span>
          </div>
          <div className="flex flex-wrap items-center pt-2">
            {userBadges.map((badge) => {
              const BadgeComponent = badgeTypeToComponentMap[badge.badge_type];
              if (!BadgeComponent) return null;
              const [firstColor, secondColor] = badge.level_colors || ['#FFFFFF', '#000000'];
              return (
                <div key={badge.id}>
                  <Tooltip className="text-sm" content={`${badge.level} ${capitalize(badge.badge_type)}`} placement="bottom">
                    <BadgeComponent
                      firstColor={firstColor}
                      secondColor={secondColor}
                      className="h-10 w-10"
                    />
                  </Tooltip>
                </div>
              );
            })}
          </div>
          <div className='pt-4'>
            <button className='bg-[#3DB1FF] flex w-full justify-center md:w-auto md:justify-start rounded-lg px-4 py-2 items-center text-white'>
              <span className='pe-2'><GrMail /></span>
              <span>Email me</span>
            </button>
          </div>
        </div>
        <div className="mb-[-1rem] md:mb-[-3rem]">
        </div>
      </div>
    </div>
  )
}
