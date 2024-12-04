import React, { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form';
import MDEditor from '@uiw/react-md-editor';
import { BsFileEarmarkPlusFill, BsFillFileEarmarkMinusFill } from 'react-icons/bs';
import { FileInput } from 'flowbite-react';

import { BLOCK_TYPES } from '../../../globals';


export function BlockForm({ blockType, control, currentCardIndex, currentBlockIndex, imagePreviews, setImagePreviews,
  setValue, register, errors }) {
  const [helpText, setHelpText] = useState("")

  const HELP_TEXTS = {
    STANDARD: "Used for general storytelling and contains no special features.",
    MONSTER: "Used to enhance the intensity of suspenseful and confrontational scenes.",
    MENTOR: "Used to provide valuable help or advice at critical moments in the story.",
    HERO: "Used to introduce and highlight the main character of the story.",
    HIGHLIGHT: "Used to highlight important aspects of the generated content."
  };

  useEffect(() => {
    const blockTypeString = BLOCK_TYPES[blockType];
    if (blockTypeString) {
      setHelpText(HELP_TEXTS[blockTypeString] || "");
    }
  }, [blockType]);

  const handleDeleteImage = (cardIndex, blockIndex) => {
    const updatedImagePreviews = { ...imagePreviews };
    delete updatedImagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image`];
    setImagePreviews(updatedImagePreviews);
    setValue(`cards.${cardIndex}.blocks.${blockIndex}.image`, null, { shouldDirty: true, shouldTouch: true });
  };

  const handleDeleteImage2 = (cardIndex, blockIndex) => {
    const updatedImagePreviews = { ...imagePreviews };
    delete updatedImagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image_2`];
    setImagePreviews(updatedImagePreviews);
    setValue(`cards.${cardIndex}.blocks.${blockIndex}.image_2`, null, { shouldDirty: true, shouldTouch: true });
  };

  return (
    <div>
      <div className='grid grid-cols-3 md:grid-cols-6'>
        <div className='hidden md:block'></div>
        <div className='text-gray-500 text-sm col-span-3 md:col-span-5'>
          {helpText}
        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3'>
        <div className='md:col-span-2 flex flex-col md:pe-4'>
          <div className="font-semibold md:pb-2">
            Text <span className='text-red-500'>*</span>
          </div>
          <div className='md:col-span-5 py-3'>
            <Controller
              control={control}
              name={`cards.${currentCardIndex}.blocks.${currentBlockIndex}.content`}
              rules={{ required: 'Block content is required.' }}
              render={({ field }) => (
                <>
                  <MDEditor
                    value={field.value}
                    height={200}
                    onChange={field.onChange}
                    preview="edit"
                  />
                </>
              )}
            />
            {errors.cards?.[currentCardIndex]?.blocks?.[currentBlockIndex]?.content &&
              <p className="text-red-500">
                {errors.cards[currentCardIndex].blocks[currentBlockIndex].content.message}
              </p>}
          </div>
        </div>
        <div className="">
          <div className="flex justify-between items-center pb-3">
            <div className='font-semibold'>
              Picture
            </div>
            <div className="flex items-center">
              {imagePreviews[`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image`] && (
                <div className='md:ps-0 pe-4'>
                  <button
                    type="button"
                    className="bg-[#FD4E3F] p-2 rounded-full text-white flex items-center"
                    onClick={() => handleDeleteImage(currentCardIndex, currentBlockIndex)}
                  >
                    <BsFillFileEarmarkMinusFill />
                  </button>
                </div>
              )}
              <div className="">
                <FileInput
                  type="file"
                  accept="image/png, image/jpeg, image/gif"
                  className='hidden'
                  {...register(`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image`)}
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImagePreviews(prev => ({ ...prev, [`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image`]: reader.result }));
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <button
                  type="button"
                  className="bg-[#5B0FFE] p-2 rounded-full text-white flex items-center"
                  onClick={() => document.querySelector(`input[name='cards.${currentCardIndex}.blocks.${currentBlockIndex}.image']`).click()}
                >
                  <BsFileEarmarkPlusFill />
                </button>
              </div>
            </div>
          </div>
          {imagePreviews[`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image`] ? (
            <div className='col-span-2 md:col-span-4 flex items-center justify-center '>
              <img
                src={imagePreviews[`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image`]}
                alt="Preview"
                className='max-h-[400px] rounded-lg'
              />
            </div>
          ) : (
            <div className='col-span-2 md:col-span-4 h-[150px] md:h-[200px] bg-white border rounded-md flex justify-center 
              items-center text-gray-500'>
              Image Preview
            </div>
          )}
          {/* {blockTypeString === 'HERO' && (
          <div className="pt-4">
            <div className='flex justify-between items-center pb-3'>
              <div className="font-semibold pb-1">Hero Image</div>
              <div className="flex items-center">
                {imagePreviews[`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image_2`] && (
                  <div className='md:ps-0 pe-4'>
                    <button
                      type="button"
                      className="bg-[#FD4E3F] p-2 rounded-full text-white flex items-center"
                      onClick={() =>
                        handleDeleteHeroImage(currentCardIndex, currentBlockIndex)
                      }
                    >
                      <BsFillFileEarmarkMinusFill />
                    </button>
                  </div>
                )}
                <div className="">
                  <FileInput
                    type="file"
                    accept="image/png, image/jpeg, image/gif"
                    className='hidden'
                    {...register(`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image_2`)}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreviews((prev) => ({
                            ...prev,
                            [`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image_2`]: reader.result,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="bg-[#5B0FFE] p-2 rounded-full text-white flex items-center"
                    onClick={() =>
                      document.querySelector(
                        `input[name='cards.${currentCardIndex}.blocks.${currentBlockIndex}.image_2']`
                      ).click()
                    }
                  >
                    <BsFileEarmarkPlusFill />
                  </button>
                </div>
              </div>
            </div>
            {imagePreviews[`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image_2`] ? (
              <div className='col-span-2 md:col-span-4 flex items-center justify-center '>
                <img
                  src={imagePreviews[`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image_2`]}
                  alt="Hero Image Preview"
                  className='max-h-[400px] rounded-lg'
                />
              </div>
            ) : (
              <div className='col-span-2 md:col-span-4 h-[150px] md:h-[200px] bg-white border rounded-md flex justify-center 
                  items-center text-gray-500'>
                Image Preview
              </div>
            )}
          </div>
        )} */}
        </div>
      </div>
    </div>

  )
}
