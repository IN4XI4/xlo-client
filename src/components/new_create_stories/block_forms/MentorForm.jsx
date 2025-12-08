import React from 'react'
import { SelectTypeForm } from './SelectTypeForm'
import { FaUser } from 'react-icons/fa';


export function MentorForm({ cardIndex, blockIndex, register, errors, globalMentor, globalSoftskill, showTypeSelector,
  value, onSelect, imagePreviews
}) {
  const color = globalMentor?.color || "#3DB1FF";
  const mentor_image = globalMentor?.picture;
  const mentor_name = globalMentor?.name;
  const mentor_job = globalMentor?.job;

  return (
    <div>
      <div className='pb-1 flex items-center'>
        <div className=''>
          {mentor_image ? (
            <img src={mentor_image} alt="Mentor"
              className="h-10 w-10 md:h-14 md:w-14 rounded-full me-2 border-[3px] cursor-pointer"
              onClick={() => openModal()}
              style={{ borderColor: color }} />
          ) : <div onClick={() => { }} className='h-10 w-10 md:h-14 md:w-14 rounded-full cursor-pointer me-2 border-[3px] flex
          items-center justify-center'>
            <FaUser className='text-gray-500' />
          </div>}
        </div>
        <div className='text-sm md:text-base'>
          <div className='font-bold'>{mentor_name}</div>
          <div className='text-gray-500'>{mentor_job}</div>
        </div>
      </div>
      <div className=' p-3 bg-gray-50 shadow rounded-2xl border-[4px] ms-8 md:ms-12 rounded-tl-none' style={{ borderColor: color }}>
        <div className=''>
          <textarea
            id="content"
            placeholder="Insert content here *"
            {...register(`cards.${cardIndex}.blocks.${blockIndex}.content`, { required: "Content is required" })}
            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 focus:shadow-none py-0"
            rows={1}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
          {errors.cards?.blocks?.content && (
            <p className="text-red-500 text-sm mt-1">{errors.cards?.blocks?.content.message}</p>
          )}
        </div>
        {imagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image`] ? (
          <div className='col-span-2 md:col-span-4 flex items-center justify-center py-3'>
            <img
              src={imagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image`]}
              alt="Preview"
              className='max-h-[400px] rounded-lg'
            />
          </div>
        ) : (
          <div></div>
        )}
        {showTypeSelector &&
          <div className='text-gray-500 pb-1 border-t-2 border-gray-200'>
            <SelectTypeForm value={value} onSelect={onSelect} size='small' />
          </div>}
      </div>

    </div>
  )
}
