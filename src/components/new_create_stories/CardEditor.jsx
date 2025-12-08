import React from 'react'
import { FileInput } from 'flowbite-react';
import { BsInfoCircleFill } from 'react-icons/bs'
import { BlocksListEditor } from './BlocksListEditor';


export function CardEditor({ register, append, errors, setValue, imagePreviews, setImagePreviews, fields, currentCardIndex, control,
  globalMentor, globalSoftSkill, setCurrentCardIndex, getValues }) {
    
  return (
    <div className='pt-3 md:pt-6'>
      <div className='pb-3'>
        <div className='hidden md:flex'>
          <div className='pe-1 pb-1'>
            Thumbnail
          </div>
          <BsInfoCircleFill
            className="w-3 h-3 text-[#1C64F2]"
          />
        </div>
        <div className='flex items-center'>
          {!imagePreviews['image'] ? (
            <div className='hidden md:flex border rounded-lg md:w-24 md:h-20 text-center items-center justify-center 
          text-sm text-gray-500 px-1 cursor-pointer'
              onClick={() => document.querySelector('input[name="image"]').click()}>
              Click to insert image
            </div>
          ) : (
            <img
              src={imagePreviews['image']}
              alt="Story Preview"
              className='hidden md:flex md:w-24 md:h-20 rounded-lg object-cover cursor-pointer'
              onClick={() => document.querySelector('input[name="image"]').click()}
            />
          )}
          <FileInput
            type="file"
            accept="image/png, image/jpeg, image/gif"
            className='hidden'
            {...register('image')}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                if (file.size > 1048576) {
                  alert('Image size must not exceed 1 MB');
                  return;
                }
                setValue('image', file, { shouldDirty: true, shouldTouch: true });
                const reader = new FileReader();
                reader.onloadend = () => {
                  setImagePreviews(prev => ({ ...prev, 'image': reader.result }));
                };
                reader.readAsDataURL(file);
              }
            }}
          />
          <div className='md:ps-1 flex-grow'>
            <div className=''>
              <input
                type='text'
                id="title"
                placeholder="Insert here a title to your story *"
                {...register("title", { required: "Title is required" })}
                className="w-full bg-transparent border-none
                     focus:outline-none focus:ring-0 focus:shadow-none
                     font-semibold text-gray-500 text-xl  xl:text-2xl py-0"
              />
              {errors.title && (
                <div className="text-red-500 text-sm mt-1 ms-3">{errors.title.message}</div>
              )}
            </div>
            <div>
              <input
                type="text"
                id="subtitle"
                placeholder="Insert here a subtitle to add some context to your title"
                {...register("subtitle")}
                className="w-full bg-transparent border-none py-0
                     focus:outline-none focus:ring-0 focus:shadow-none
                     text-gray-500 placeholder-gray-400"
              />
              {errors.subtitle && (
                <p className="text-red-500 text-sm mt-1">{errors.subtitle.message}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <BlocksListEditor key={currentCardIndex} fields={fields} currentCardIndex={currentCardIndex} control={control} setValue={setValue} register={register}
        errors={errors} globalMentor={globalMentor} globalSoftSkill={globalSoftSkill} append={append} imagePreviews={imagePreviews}
        setCurrentCardIndex={setCurrentCardIndex} getValues={getValues} setImagePreviews={setImagePreviews} />
    </div>
  )
}
