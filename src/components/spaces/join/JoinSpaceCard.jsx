import React, { useState } from 'react'
import { FaUsers } from 'react-icons/fa'
import { RocketIcon } from '../../illustrations/icons/RocketIcon'
import { JoinSpaceDetailModal } from './JoinSpaceDetailModal';


export function JoinSpaceCard({ space, onRequestSent }) {
  const [showJoinSpaceDetailModal, setShowJoinSpaceDetailModal] = useState(false);

  const openJoinSpaceDetailModal = () => {
    setShowJoinSpaceDetailModal(true);
  };

  const closeJoinSpaceDetailModal = () => {
    setShowJoinSpaceDetailModal(false);
  };

  const handleRequestSuccess = () => {
    onRequestSent?.(space.id);
    closeJoinSpaceDetailModal();
  };

  let statusText = "Ask to join";
  let bgColor = 'bg-[#43B29D]';
  let textColor = 'text-white';
  let borderStyle = '';

  if (space.is_member) {
    statusText = "Joined";
    bgColor = 'bg-[#3DB1FF]';
    textColor = 'text-white';
  } else if (space.has_membership_request) {
    statusText = "Pending";
    bgColor = 'bg-[#E1EEEC]';
    textColor = 'text-[#43B29D]';
    borderStyle = 'border border-[#43B29D]';
  }

  return (
    <div className='flex justify-between items-center py-2 border-b'>
      <div className='flex truncate items-center'>
        <div className='rounded-full flex items-center justify-center h-14 w-14 flex-shrink-0'>
          {space.image ? (
            <img src={space.image}
              alt="Profile"
              className="h-14 w-14 border-2 rounded-full cursor-pointer"
              onClick={statusText === 'ask to join' ? openJoinSpaceDetailModal : undefined} />
          ) : space.id ? (
            <RocketIcon
              color={space.color_name}
              className={"h-12 w-12 cursor-pointer"}
              onClick={statusText === 'ask to join' ? openJoinSpaceDetailModal : undefined} />
          ) : (<img src={logo} alt="" />)}
        </div>
        <div className='truncate text-start ps-2 text-gray-500'>
          <div className='font-semibold'>{space.name}</div>
          <div className='truncate text-sm'>{space.description}</div>
          <div className='flex items-center text-sm text-gray-400'>
            <FaUsers />
            <span className='ps-1'>{space.members_count} | #{space.slug}:mixelo.io</span>
          </div>
        </div>
      </div>
      <div className={`ms-1 flex whitespace-nowrap rounded-full px-3 text-sm cursor-pointer ${bgColor} ${textColor} ${borderStyle}`}>
        <div className='font-semibold' onClick={statusText === 'Ask to join' ? openJoinSpaceDetailModal : undefined}>
          {statusText}
        </div>
      </div>
      {showJoinSpaceDetailModal && (
        <JoinSpaceDetailModal space={space} onCancel={closeJoinSpaceDetailModal} onRequestSuccess={handleRequestSuccess} />
      )}
    </div>
  )
}
