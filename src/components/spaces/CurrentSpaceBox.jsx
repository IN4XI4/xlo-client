import React from 'react'
import { ToggleSwitch } from 'flowbite-react';

import logo from '../../assets/Logo.svg';
import rocket from '../../assets/rocket.svg';
import { useSpace } from '../../context/SpaceContext';


export function CurrentSpaceBox({ currentSpaceColor, spaceInfo }) {

  const { activeSpace, setActiveSpace } = useSpace();

  const handleActiveSpaceToggle = () => {
    if (!spaceInfo?.id || activeSpace?.id === spaceInfo.id) {
      setActiveSpace(null);
    } else {
      setActiveSpace({ id: spaceInfo.id, name: spaceInfo.name });
    }
  };
  const isSpaceActive = activeSpace?.id === spaceInfo?.id;
  const isButtonDisabled = spaceInfo?.id && !spaceInfo?.is_member;

  return (
    <div className='bg-white rounded px-3 py-4 flex items-center border border-gray-100 mb-3'>
      <div className='bg-gray-100 rounded-full flex items-center justify-center h-24 w-24 flex-shrink-0'>
        {spaceInfo.image ? (
          <img src={spaceInfo.image} alt="Profile" className="h-24 w-24 border-4 rounded-full"
            style={{ borderColor: currentSpaceColor }} />
        ) : spaceInfo.id ? (
          <img src={rocket} alt="" />
        ) : (<img src={logo} alt="" />)}
      </div>
      <div className='ps-3 flex-grow'>
        <div className='font-bold'>Space Activation</div>
        <div className='pb-3 text-gray-500 text-sm'>
          {spaceInfo.name || 'Mixelo Space'}
        </div>
        <div className='flex items-center'>
          <ToggleSwitch
            color='cyan'
            checked={isSpaceActive}
            disabled={isButtonDisabled}
            onChange={handleActiveSpaceToggle}
          />
          <span className={`ps-3 text-sm  ${isSpaceActive ? 'text-[#3DB1FF]' : 'text-gray-500'}`}>
            {isSpaceActive ? 'The space is active' : 'The space is inactive'}
          </span>
        </div>
      </div>
    </div>
  )
}
