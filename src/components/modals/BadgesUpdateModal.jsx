// components/BadgeUpdateModal.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from 'flowbite-react';
import { FaXmark } from 'react-icons/fa6';
import { badgeTypeToComponentMap } from '../../globals';


function capitalize(text) {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function BadgeUpdateModal({ badges, onClose }) {
  const navigate = useNavigate();
  if (!badges || badges.length === 0) return null;

  const handleNavigateToProfile = () => {
    onClose();
    navigate('/profile');
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-40 bg-gray-300 bg-opacity-50 flex items-center justify-center" onClick={onClose}>
      <div className="bg-white p-3 md:p-5 rounded-lg shadow-lg text-center w-5/6 md:w-1/2 lg:w-1/3 xl:w-1/4 3xl:w-1/5"
        onClick={handleModalClick}>
        <div className='text-gray-500 flex justify-end cursor-pointer hover:text-gray-600' onClick={onClose}>
          <FaXmark className='text-2xl' />
        </div>
        <div className="text-2xl font-bold text-center py-3">Congratulations!</div>
        <div className="text-center py-3">You've earned new badges:</div>
        <div className="flex flex-wrap justify-center items-center py-3">
          {badges.map((badge) => {
            const BadgeComponent = badgeTypeToComponentMap[badge.badge_type];
            if (!BadgeComponent) return null;
            const [firstColor, secondColor] = badge.level_colors || ['#FFFFFF', '#000000'];
            return (
              <div key={badge.id} className="m-1">
                <Tooltip
                  className="text-sm"
                  content={`${badge.level} ${capitalize(badge.badge_type)}`}
                  placement="bottom"
                >
                  <BadgeComponent firstColor={firstColor} secondColor={secondColor} className="h-14 w-14" />
                </Tooltip>
              </div>
            );
          })}
        </div>
        <button
          className="bg-[#3DB1FF] text-white px-6 py-3 rounded-lg my-3"
          onClick={handleNavigateToProfile}
        >
          Go to Profile
        </button>
      </div>
    </div>
  );
}
