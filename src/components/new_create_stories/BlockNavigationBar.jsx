import React from 'react'
import { useWatch } from 'react-hook-form';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { MagicWand } from '../illustrations/icons/MagicWand';
import { TbPhotoPlus, TbPhotoMinus } from "react-icons/tb";

import { FileInput } from 'flowbite-react';

export function BlockNavigationBar({ control, register, currentCardIndex, currentBlockIndex, getValues, setValue, imagePreviews,
  setImagePreviews, insertBlock, removeBlock, typeSelectorVisibility, setTypeSelectorVisibility, blockType,
  showMainImage = true, showSecondImage = false }) {

  const blocks = useWatch({
    control,
    name: `cards.${currentCardIndex}.blocks`,
  });
  const blockCount = blocks?.length ?? 0;

  const toggleTypeSelector = (cardIndex, blockIndex) => {
    const key = `${cardIndex}-${blockIndex}`;
    setTypeSelectorVisibility(prev => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAddImage = (main_image = true) => {
    const fieldSuffix = main_image ? 'image' : 'image_2';
    const fileInput = document.querySelector(`input[name='cards.${currentCardIndex}.blocks.${currentBlockIndex}.${fieldSuffix}']`);
    if (fileInput) {
      fileInput.click();
      fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const fileData = reader.result;
            setImagePreviews(prev => ({
              ...prev,
              [`cards.${currentCardIndex}.blocks.${currentBlockIndex}.${fieldSuffix}`]: fileData
            }));
            setValue(`cards.${currentCardIndex}.blocks.${currentBlockIndex}.${fieldSuffix}`, file, {
              shouldDirty: true,
              shouldTouch: true
            });
          };
          reader.readAsDataURL(file);
        } else {
          console.warn("No file selected.");
        }
      }, { once: true });
    } else {
      console.error("File input not found.");
    }
  };

  const handleDeleteImage = (cardIndex, blockIndex, main_image = true) => {
    const fieldSuffix = main_image ? 'image' : 'image_2';
    const updatedImagePreviews = { ...imagePreviews };
    delete updatedImagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.${fieldSuffix}`];
    setImagePreviews(updatedImagePreviews);
    setValue(`cards.${cardIndex}.blocks.${blockIndex}.${fieldSuffix}`, null, { shouldDirty: true, shouldTouch: true });
  };

  function updateImagePreviewsForBlocks(imagePreviews, cardIndex, blockIndexToRemove) {
    const newImagePreviews = {};

    Object.keys(imagePreviews).forEach(key => {
      const match = key.match(/^cards\.(\d+)\.blocks\.(\d+)\.image$/);

      if (match) {
        const [_, matchedCardIndex, blockIndex] = match.map(Number);

        if (matchedCardIndex === cardIndex) {
          if (blockIndex > blockIndexToRemove) {
            const newKey = `cards.${cardIndex}.blocks.${blockIndex - 1}.image`;
            newImagePreviews[newKey] = imagePreviews[key];
          } else if (blockIndex < blockIndexToRemove) {
            newImagePreviews[key] = imagePreviews[key];
          }
        } else {
          newImagePreviews[key] = imagePreviews[key];
        }
      } else {
        newImagePreviews[key] = imagePreviews[key];
      }
    });

    return newImagePreviews;
  }

  function updateImagePreviewsForInsert(imagePreviews, cardIndex, insertAt) {
    const newImagePreviews = {};
    Object.keys(imagePreviews).forEach((key) => {
      const match = key.match(/^cards\.(\d+)\.blocks\.(\d+)\.(image|image_2)$/);
      if (!match) {
        newImagePreviews[key] = imagePreviews[key];
        return;
      }

      const matchedCardIndex = Number(match[1]);
      const blockIndex = Number(match[2]);
      const suffix = match[3];

      if (matchedCardIndex !== cardIndex) {
        newImagePreviews[key] = imagePreviews[key];
        return;
      }

      // si está en/after insertAt, súbele 1
      if (blockIndex >= insertAt) {
        const newKey = `cards.${cardIndex}.blocks.${blockIndex + 1}.${suffix}`;
        newImagePreviews[newKey] = imagePreviews[key];
      } else {
        newImagePreviews[key] = imagePreviews[key];
      }
    });

    return newImagePreviews;
  }

  const handleRemoveBlock = (cardIndex, blockIndex) => {
    const updatedImagePreviews = updateImagePreviewsForBlocks(imagePreviews, cardIndex, blockIndex);
    setImagePreviews(updatedImagePreviews);
    removeBlock(blockIndex);
    const cards = getValues('cards');
    if (blockIndex === 0 && cards[cardIndex].blocks.length > 0) {
      setValue(`cards.${cardIndex}.blocks.0`, { ...cards[cardIndex].blocks[0] }, { shouldDirty: true, shouldTouch: true });
    }
  };

  return (
    <div className='flex justify-end pb-3'>
      <div className='flex justify-end'>
        {blockType !== '' && showMainImage && (
          <div className="">
            <FileInput
              type="file"
              accept="image/png, image/jpeg, image/gif"
              className="hidden"
              {...register(`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image`)}
            />
            <button type="button" onClick={handleAddImage}
              className="bg-[#1C64F2] p-2 rounded-full text-white flex items-center me-2">
              <TbPhotoPlus />
            </button>
          </div>
        )}
        {blockType !== '' && showMainImage && imagePreviews[`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image`] && (
          <div className=''>
            <button type="button" onClick={() => handleDeleteImage(currentCardIndex, currentBlockIndex)}
              className="bg-[#FD4E3F] p-2 rounded-full text-white flex items-center me-2">
              <TbPhotoMinus />
            </button>
          </div>
        )}
        {blockType !== '' && showSecondImage && (
          <div className="">
            <FileInput
              type="file"
              accept="image/png, image/jpeg, image/gif"
              className="hidden"
              {...register(`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image_2`)}
            />
            <button type="button" onClick={() => handleAddImage(false)}
              className="bg-[#1C64F2] p-2 rounded-full text-white flex items-center me-2">
              <TbPhotoPlus />
            </button>
          </div>
        )}
        {blockType !== '' && showSecondImage && imagePreviews[`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image_2`] && (
          <div className=''>
            <button type="button" onClick={() => handleDeleteImage(currentCardIndex, currentBlockIndex, false)}
              className="bg-[#FD4E3F] p-2 rounded-full text-white flex items-center me-2">
              <TbPhotoMinus />
            </button>
          </div>
        )}
        {blockType !== '' && (
          <button type="button" onClick={() => toggleTypeSelector(currentCardIndex, currentBlockIndex)}
            className={`p-2 rounded-full flex items-center me-2 ${typeSelectorVisibility[`${currentCardIndex}-${currentBlockIndex}`]
              ? 'bg-[#9B51E0]'
              : 'bg-gray-500'
              } text-white`}>
            <MagicWand />
          </button>
        )}
        {blockCount > 1 && (
          <button type="button" onClick={() => handleRemoveBlock(currentCardIndex, currentBlockIndex)}
            className="bg-[#FD4E3F] p-2 rounded-full text-white flex items-center me-2">
            <FaMinusCircle />
          </button>
        )}
        <button type="button"
          onClick={() => {
            const insertAt = currentBlockIndex + 1;
            setImagePreviews((prev) =>
              updateImagePreviewsForInsert(prev, currentCardIndex, insertAt)
            );
            insertBlock(insertAt, { content: "", blockType: "" });
          }}
          className="bg-[#5B0FFE] p-2 rounded-full text-white flex items-center">
          <FaPlusCircle />
        </button>
      </div>
    </div>
  )
}

