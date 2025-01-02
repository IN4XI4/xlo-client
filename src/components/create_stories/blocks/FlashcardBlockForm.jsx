import React from 'react'
import { FileInput } from 'flowbite-react';
import { BsFileEarmarkPlusFill, BsFillFileEarmarkMinusFill } from 'react-icons/bs';
import { Controller } from 'react-hook-form';
import MDEditor from '@uiw/react-md-editor';


export function FlashcardBlockForm({ control, currentCardIndex, currentBlockIndex, register, setImagePreviews, setValue,
  imagePreviews, errors }) {

  const handleAddImage2 = () => {
    const fileInput = document.querySelector(`input[name='cards.${currentCardIndex}.blocks.${currentBlockIndex}.image_2']`);
    if (fileInput) {
      fileInput.click();
      fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setImagePreviews(prev => ({
              ...prev,
              [`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image_2`]: reader.result,
            }));
            setValue(`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image_2`, file, {
              shouldDirty: true,
              shouldTouch: true,
            });
          };
          reader.readAsDataURL(file);
        }
      }, { once: true });
    }
  };

  const handleDeleteImage2 = (cardIndex, blockIndex) => {
    const updatedImagePreviews = { ...imagePreviews };
    delete updatedImagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image_2`];
    setImagePreviews(updatedImagePreviews);
    setValue(`cards.${cardIndex}.blocks.${blockIndex}.image_2`, null, { shouldDirty: true, shouldTouch: true });
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-3'>
      <div className='md:col-span-2 flex flex-col md:pe-4'>
        <div className="font-semibold pb-2">
          Verso text <span className='text-red-500'>*</span>
        </div>
        <div className='py-3'>
          <Controller
            control={control}
            name={`cards.${currentCardIndex}.blocks.${currentBlockIndex}.content_2`}
            rules={{ required: 'Verso content is required.' }}
            render={({ field }) => (
              <>
                <MDEditor
                  value={field.value ?? ""}
                  height={200}
                  onChange={field.onChange}
                  preview="edit"
                />
              </>
            )}
          />
          {errors.cards?.[currentCardIndex]?.blocks?.[currentBlockIndex]?.content_2 &&
            <p className="text-red-500">{errors.cards?.[currentCardIndex]?.blocks?.[currentBlockIndex]?.content_2.message}</p>}
        </div>
      </div>
      <div>
        <div className="flex justify-between items-center pb-3">
          <div className='font-semibold'>
            Verso Picture
          </div>
          <div className="flex items-center">
            {imagePreviews[`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image_2`] && (
              <div className='md:ps-0 pe-4'>
                <button
                  type="button"
                  className="bg-[#FD4E3F] p-2 rounded-full text-white flex items-center"
                  onClick={() => handleDeleteImage2(currentCardIndex, currentBlockIndex)}
                >
                  <BsFillFileEarmarkMinusFill />
                </button>
              </div>
            )}
            <div className="">
              <FileInput
                type="file"
                accept="image/png, image/jpeg, image/gif"
                className="hidden"
                {...register(`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image_2`)}
              />
              <button
                type="button"
                className="bg-[#5B0FFE] p-2 rounded-full text-white flex items-center"
                onClick={handleAddImage2}
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
      </div>
    </div>
  )
}
