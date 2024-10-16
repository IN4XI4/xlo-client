import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';

import logo from '../../assets/Logo.svg';
import { updateSpace } from '../../api/spaces.api';
import { useSpace } from '../../context/SpaceContext';


export function CurrentSpaceBoxOwner({ currentSpaceColor, spaceInfo }) {

  const [selectedImage, setSelectedImage] = useState(null);
  const { activeSpace, setActiveSpace } = useSpace();

  const handleActiveSpaceToggle = () => {
    console.log("space info id", spaceInfo.id);
    console.log("space active id", activeSpace);

    if (!spaceInfo?.id) {
      return;
    }
    if (activeSpace?.id === spaceInfo.id) {
      setActiveSpace(null);
    } else {
      setActiveSpace({ id: spaceInfo.id, name: spaceInfo.name });
    }
  };

  const handleClickChangePicture = () => {
    if (isOwner) {
      document.getElementById('space-picture-input').click();
    }
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
      console.log("por aca va boludo");
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
        const newSpacePictureUrl = response.data.image;
        const event = new CustomEvent('spacePictureUpdated', { detail: newSpacePictureUrl });
        window.dispatchEvent(event);
      } catch (error) {
        console.error("Error al actualizar la imagen:", error);
      }
    }
  };

  const isSpaceActive = activeSpace?.id === spaceInfo.id;
  const buttonText = spaceInfo.id
    ? isSpaceActive ? 'Active Space' : 'Inactive Space'
    : 'Active Space';
  const buttonStyle = spaceInfo.id
    ? isSpaceActive
      ? 'bg-[#3DB1FF] text-white'
      : 'bg-[#E6EFF5] text-[#3DB1FF]'
    : 'bg-[#3DB1FF] text-white';
  const ButtonIcon = isSpaceActive ? FaEye : FaEyeSlash;

  return (
    <div className='bg-white rounded px-3 py-4 flex items-center border border-gray-100 mb-3'>
      {/* <div className='bg-gray-100 rounded-full flex items-center justify-center h-24 w-24 flex-shrink-0 cursor-pointer'
        onClick={isOwner ? handleClickChangePicture : null}>
        {selectedImage ? (
          <img src={selectedImage} alt="Selected" className="h-24 w-24 border-4 rounded-full"
            style={{ borderColor: currentSpaceColor }} />
        ) : spaceInfo.image ? (
          <img src={spaceInfo.image} alt="Profile" className="h-24 w-24 border-4 rounded-full"
            style={{ borderColor: currentSpaceColor }} />
        ) : spaceInfo.id ? (
          <div>

          </div>
        ) : (<img src={logo} alt="" />)}
      </div> */}
      <div className='ps-3 flex-grow'>
        <div className='font-bold'>Space Activation</div>
        <div className='pb-3 text-gray-500 text-sm'>
          {spaceInfo.name || 'Mixelo Space'}
        </div>
        <div className='flex justify-end'>
          <button className={`${buttonStyle} px-3 py-2 rounded-lg flex items-center w-44 justify-center`}
            onClick={handleActiveSpaceToggle}>
            <span><ButtonIcon /></span> <span className='ps-2'>{buttonText}</span>
          </button>
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
