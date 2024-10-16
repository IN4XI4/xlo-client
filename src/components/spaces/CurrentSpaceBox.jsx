import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
  
  const buttonText = isSpaceActive ? 'Active Space' : 'Inactive Space';
  const buttonStyle = isSpaceActive ? 'bg-[#3DB1FF] text-white' : 'bg-[#E6EFF5] text-[#3DB1FF]';
  const disabledStyle = 'bg-[#E6EFF5] text-gray-500 cursor-not-allowed';
  const ButtonIcon = isSpaceActive ? FaEye : FaEyeSlash;

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
        <div className='flex justify-end'>
          <button className={`${isButtonDisabled ? disabledStyle : buttonStyle} px-3 py-2 rounded-lg flex 
          items-center w-44 justify-center`} onClick={isButtonDisabled ? null : handleActiveSpaceToggle}>
            <span><ButtonIcon /></span> <span className='ps-2'>{buttonText}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
