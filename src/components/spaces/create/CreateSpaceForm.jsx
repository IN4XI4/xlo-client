import React, { useState } from 'react'
import { FaArrowLeft, FaCog, FaDotCircle, FaRegCircle, FaRocket } from 'react-icons/fa';
import { Label, Textarea, TextInput } from 'flowbite-react';
import { createSpace } from '../../../api/spaces.api';
import { useNavigate } from 'react-router-dom';


export function CreateSpaceForm({ profileColors, newSpaceData, setNewSpaceData, setPage, onCancel }) {
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleClickChangePicture = () => {
    document.getElementById('profile-picture-input').click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setNewSpaceData((prev) => ({
        ...prev,
        imageFile: file,
        imagePreviewUrl: previewUrl,
      }));
    }
  };

  const handleProfileColorChange = (colorId) => {
    setNewSpaceData((prev) => ({
      ...prev,
      profileColorId: colorId,
    }));
  };

  const handleCreateSpace = async () => {

    const newErrors = {};

    if (!newSpaceData.name || newSpaceData.name.trim() === "") {
      newErrors.name = "Name is required";
    }

    if (!newSpaceData.profileColorId) {
      newErrors.profileColorId = "Please select a color";
    }

    if (!newSpaceData.categoryIds || newSpaceData.categoryIds.length === 0) {
      newErrors.categoryIds = "At least one category is required";
    }

    if (Object.keys(newErrors).length > 0) {

      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      const formData = new FormData();
      formData.append("name", newSpaceData.name);
      formData.append("description", newSpaceData.description || "");
      formData.append("color", newSpaceData.profileColorId);
      formData.append("isPrivate", newSpaceData.isPrivate);
      newSpaceData.categoryIds.forEach(id => {
        formData.append("category_ids", id);
      });
      if (newSpaceData.imageFile) {
        formData.append("image", newSpaceData.imageFile);
      }

      const response = await createSpace(formData);
      onCancel();
      navigate('/spaces', { state: { spaceCreated: true } });
    }  catch (error) {
      console.error("Error creating space:", error);
    
      if (error.response && error.response.data) {
        const backendErrors = {};
    
        if (error.response.data.name) {
          backendErrors.name = error.response.data.name[0];
        }
        setErrors(backendErrors);
      } else {
        alert("There was an unexpected error. Please try again.");
      }
    }
  }; 


  return (
    <div>
      <div className="py-3 md:px-6">
        <div className="text-gray-500 text-center pb-2">Add some details to help it stand out!</div>
        <div className='bg-white rounded px-3 md:px-6 py-3 flex items-center justify-between border border-gray-100 mb-3'>
          <div className=''>
            {newSpaceData.imagePreviewUrl ? (
              <img src={newSpaceData.imagePreviewUrl} alt="Selected" className="h-20 w-20 border-2 rounded-full" />
            ) : (
              <>
                <div className='bg-[#8BD0FF] border-[#3DB1FF] rounded-full flex items-center justify-center 
                  h-20 w-20 border-2'>
                </div>
              </>
            )}
          </div>
          <div className='ps-3'>
            <button className='bg-[#3DB1FF] px-3 py-2 rounded-lg text-white flex items-center'
              onClick={handleClickChangePicture}>
              <span><FaCog /></span> <span className='ps-2'>Upload Image</span>
            </button>
            <input
              type="file"
              id="profile-picture-input"
              style={{ display: 'none' }}
              onChange={handleImageChange}
              accept="image/*"
            />
          </div>
        </div>
        <div className='bg-white rounded px-3 py-3 border border-gray-100 mb-3'>
          <div className='font-bold pb-2 text-start'>Select the color of this space</div>
          <div className='flex justify-between'>
            {profileColors && profileColors.map((color, index) => {
              const isCurrentColor = color.id === newSpaceData.profileColorId;
              const Icon = isCurrentColor ? FaDotCircle : FaRegCircle;
              return (
                <Icon
                  key={index}
                  className='cursor-pointer'
                  style={{ color: color.color }}
                  onClick={() => handleProfileColorChange(color.id)} />
              );
            })}
          </div>
          {errors.profileColorId && <p className="text-start text-red-500 text-sm mt-1">{errors.profileColorId}</p>}
        </div>
        <div className='bg-white rounded px-3 pt-3 pb-2 border border-gray-100 mb-3'>
          <div className="mb-2 text-start">
            <Label className='font-semibold' htmlFor="name" value="Name of this space" />
          </div>
          <TextInput
            id="name"
            type="text"
            placeholder="Enter a name for this space"
            rules={{ required: true }}
            value={newSpaceData.name || ''}
            onChange={(e) =>
              setNewSpaceData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
          {errors.name && <p className="text-start text-red-500 text-sm">{errors.name}</p>}
          <div className="mb-2 text-start mt-3">
            <Label className='font-semibold' htmlFor="description" value="Description of this space" />
          </div>
          <Textarea
            id="description"
            type="text"
            rows={4}
            placeholder="Write a short text for your community, describing the intended use of this space."
            className='mb-3'
            value={newSpaceData.description || ''}
            onChange={(e) =>
              setNewSpaceData((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </div>
        <div className='text-center text-gray-500 pb-2 border-b'>
          You can change this later
        </div>

      </div>
      {errors.categoryIds && (
        <div className="text-red-500 text-sm text-start mb-2">
          {errors.categoryIds}
        </div>
      )}
      <div className='flex justify-between items-center pt-2'>
        <div
          className='flex justify-center items-center text-sm bg-[#3DB1FF] px-7 rounded-lg text-white py-1 cursor-pointer'
          onClick={() => setPage(1)}
        >
          <FaArrowLeft /> <span className='ps-2 lg:text-base'>Previous</span>
        </div>
        <div
          className='flex justify-center items-center text-sm bg-[#3DB1FF] px-2 md:px-3 rounded-lg text-white py-1 cursor-pointer'
          onClick={handleCreateSpace}
        >
          <FaRocket /> <span className='ps-2 lg:text-base'>Create a space</span>
        </div>
      </div>
    </div>
  )
}
