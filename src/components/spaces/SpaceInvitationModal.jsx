import React from 'react'
import { FaRegCircleXmark } from "react-icons/fa6";

import { RocketIcon } from '../illustrations/icons/RocketIcon';
import { acceptInvitation, rejectInvitation } from '../../api/spaces.api';

export function SpaceInvitationModal({ invitationData, onCancel, onActionComplete }) {
  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  const handleAccept = async () => {
    try {
      await acceptInvitation(invitationData.id);
      onActionComplete('Invitation accepted successfully!')
      onCancel();
    } catch (error) {
      console.error("Error al aceptar la invitación:", error);
    }
  };

  const handleReject = async () => {
    try {
      await rejectInvitation(invitationData.id);
      onActionComplete('Invitation rejected successfully!', 'info');
      onCancel();
    } catch (error) {
      console.error("Error al rechazar la invitación:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center" onClick={onCancel}>
      <div className="bg-white px-4 md:px-6 py-4 rounded-lg shadow-lg text-center w-11/12 md:w-1/4" onClick={handleModalClick}>
        <div className="flex justify-between pb-3 border-b">
          <div className='flex items-end'>
            <div>
              {invitationData.space_image ? (
                <img src={invitationData.space_image} alt="Profile"
                  className="w-14 h-14 md:w-[4.2rem] md:h-[4.2rem] rounded-full"
                  style={{ borderColor: invitationData.space_color }} />
              ) : (
                <RocketIcon color={invitationData.space_color}
                  className="w-14 h-14 md:w-[4.2rem] md:h-[4.2rem] rounded-full" />
              )}
            </div>
            <div className='pb-2 ps-2 font-bold text-lg'>{invitationData.space_name}</div>
          </div>
          <div className='text-gray-500 flex justify-end cursor-pointer hover:text-gray-600' onClick={onCancel}>
            <FaRegCircleXmark className='text-2xl' />
          </div>
        </div>
        <div className='py-3 text-start text-gray-500 border-b text-sm'>
          #{invitationData.space_slug}:mixelo.io
        </div>
        <div className='py-3 text-gray-500 text-start border-b text-sm'>
          {invitationData.space_description}
        </div>
        <div className='flex justify-between py-3 items-center text-white text-sm'>
          <button className='bg-[#FD4E3F] p-2 flex items-center rounded-lg'  onClick={handleReject}>
            <FaRegCircleXmark />
            <span className='ps-1'>Reject invitation</span>
          </button>
          <button className='bg-[#43B29D] p-2 flex items-center rounded-lg' onClick={handleAccept}>
            <FaRegCircleXmark />
            <span className='ps-1'>Accept invitation</span>
          </button>
        </div>
      </div>
    </div>
  )
}
