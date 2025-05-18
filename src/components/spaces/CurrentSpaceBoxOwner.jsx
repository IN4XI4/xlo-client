import React, { useState } from 'react'
import { ToggleSwitch } from 'flowbite-react';

import logo from '../../assets/Logo.svg';
import { updateSpace } from '../../api/spaces.api';
import { useSpace } from '../../context/SpaceContext';
import { RocketIcon } from '../illustrations/icons/RocketIcon';


export function CurrentSpaceBoxOwner({ currentSpaceColor, spaceInfo }) {

  const [selectedImage, setSelectedImage] = useState(null);
  const { activeSpace, setActiveSpace } = useSpace();

  const handleActiveSpaceToggle = () => {
    if (!spaceInfo?.id || activeSpace?.id === spaceInfo.id) {
      setActiveSpace(null);
    } else {
      setActiveSpace({ id: spaceInfo.id, name: spaceInfo.name });
    }
  };

  const handleClickChangePicture = () => {
    document.getElementById('space-picture-input').click();
  };

  const MAX_FILE_SIZE = 4 * 1024 * 1024;
  const handleImageChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];

      if (file.size > MAX_FILE_SIZE) {
        alert("The file is too large. Maximum allowed size: 4 MB.");
        return;
      }
      let reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append("image", file);

      try {
        if (!spaceInfo || !spaceInfo.id) {
          console.error("Space ID is missing");
          return;
        }
        const spaceId = spaceInfo.id;
        const response = await updateSpace(spaceId, formData);
        if (activeSpace?.id === spaceId) {
          setActiveSpace({ ...activeSpace });
        }
        const newSpacePictureUrl = response.data.image;
        const event = new CustomEvent('spacePictureUpdated', { detail: newSpacePictureUrl });
        window.dispatchEvent(event);
      } catch (error) {
        console.error("Error al actualizar la imagen:", error);
      }
    }
  };

  const isSpaceActive = activeSpace?.id === spaceInfo.id;

  return (
    <div className='bg-white rounded px-3 py-4 flex items-center border border-gray-100 mb-3'>
      <div className='bg-gray-100 rounded-full flex items-center justify-center h-24 w-24 flex-shrink-0 cursor-pointer'
        onClick={handleClickChangePicture}>
        {selectedImage ? (
          <img src={selectedImage} alt="Selected" className="h-24 w-24 border-4 rounded-full"
            style={{ borderColor: currentSpaceColor }} />
        ) : spaceInfo.image ? (
          <img src={spaceInfo.image} alt="Profile" className="h-24 w-24 border-4 rounded-full"
            style={{ borderColor: currentSpaceColor }} />
        ) : spaceInfo.id ? (
          <RocketIcon color={spaceInfo.color_name} />
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
            onChange={handleActiveSpaceToggle}
          />
          <span className={`ps-3 text-sm  ${isSpaceActive ? 'text-[#3DB1FF]' : 'text-gray-500'}`}>
            {isSpaceActive ? 'The space is active' : 'The space is inactive'}
          </span>
        </div>
        <input
          type="file"
          id="space-picture-input"
          style={{ display: 'none' }}
          onChange={handleImageChange}
          accept="image/*"
        />
      </div>
    </div>
  )
}
