import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa6';

import { getMyAvatar } from '../../api/avatar.api';
import { AvatarRenderer } from '../profile/avatar/AvatarRenderer';


export function MyAvatarTile() {
  const [isOpen, setIsOpen] = useState(true);
  const [myAvatar, setMyAvatar] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadMyAvatar();
  }, []);

  async function loadMyAvatar() {
    try {
      const response = await getMyAvatar();
      setMyAvatar(response.data);
    } catch (error) {
      setError(error);
    }
  }
  const renderAvatar = useMemo(() => myAvatar, [myAvatar]);
  return (
    <div className='flex flex-col '>
      <div className={`bg-[#B8E3FF] rounded-xl p-3 mb-3 sm:mb-0 ${isOpen ? "flex-grow flex flex-col" : ""}`}>
        <div className='flex items-center' onClick={() => setIsOpen(!isOpen)}>
          <div className='flex-grow pe-3 cursor-pointer'>
            <div className='text-[#3DB1FF] font-bold md:text-xl xl:text-2xl border-b-2 border-[#3DB1FF]'>
              My avatar
            </div>
            <div className='text-end text-[#3DB1FF] text-sm pb-1'>
              [Follow the progress of your character]
            </div>
          </div>
          <div>
            <div className="text-[#3DB1FF] text-xl cursor-pointer">
              {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
        </div>
        {isOpen && (
          <div className='flex-grow flex flex-col py-2 md:py-0'>
            <div className='flex items-center justify-center py-3 md:pb-4 bg-white rounded-lg mb-2'>
              {isLoading ? (
                <div className='flex justify-center items-center pt-3'>
                  <FaSpinner className="text-[#3DB1FF] text-4xl animate-spin" />
                </div>
              ) : (
                <div className='flex px-4 flex-grow'>
                  <AvatarRenderer avatar={renderAvatar} size="h-40" />
                  <div className='pt-4'>
                    <div className='text-[#3DB1FF] pb-2'>You're: <span className='font-semibold'>Apprentice hero</span> </div>
                    <div className='text-[#3DB1FF]'>Collected: <span className='font-semibold'> 0 $MC</span></div>

                  </div>
                </div>
              )}
            </div>
            <div className='flex justify-end items-end pt-1'>
              <Link to={`/avatar`} className='bg-[#3DB1FF] px-4 py-1 rounded-lg text-white cursor-pointer'
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                SEE MY AVATAR
              </Link>
            </div>
          </div>)}
      </div>
    </div>
  )
}
