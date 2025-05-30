import React from 'react'
import { FaArrowRight, FaRegCircleXmark } from 'react-icons/fa6'
import { RocketIcon } from '../../illustrations/icons/RocketIcon';
import { requestJoinSpace } from '../../../api/spaces.api';


export function JoinSpaceDetailModal({ space, onCancel, onRequestSuccess }) {

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  const handleJoinClick = async () => {
    try {
      await requestJoinSpace({ space: space.id });
      onRequestSuccess?.(space.id);
    } catch (error) {
      console.error("Failed to join space:", error);
    } finally {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onCancel}>
      <div className="bg-white px-4 py-4 rounded-lg shadow-lg w-11/12 md:w-1/3 my-3"
        onClick={handleModalClick}>
        <div className='flex justify-between border-b pb-3 '>
          <div className='flex items-end ps-3'>
            <div className='rounded-full flex items-center justify-center h-14 w-14 flex-shrink-0'>
              {space.image ? (
                <img src={space.image} alt="Profile" className="h-14 w-14 border-2 rounded-full" />
              ) : space.id ? (
                <RocketIcon color={space.color_name} className={"h-12 w-12"} />
              ) : (<img src={logo} alt="" />)}
            </div>
            <div className='ps-3 pb-2 text-[#43B29D] font-semibold'>
              {space.name}
            </div>
          </div>
          <div className='text-gray-500 flex justify-end cursor-pointer hover:text-gray-600' onClick={onCancel}>
            <FaRegCircleXmark className='text-2xl' />
          </div>
        </div>
        <div className='text-start font-semibold py-3 border-b'>
          #{space.slug}:mixelo.io
        </div>
        <div className='text-start text-gray-500 py-3 border-b'>
          {space.description}
        </div>
        <div className='flex justify-end items-center py-3'>
          <div className='bg-[#43B29D] text-white px-4 py-2 rounded-lg flex items-center cursor-pointer'
            onClick={handleJoinClick}>
            <FaArrowRight /> <span className='text-sm ps-2'>Join the space</span>
          </div>
        </div>
      </div>
    </div>
  )
}
