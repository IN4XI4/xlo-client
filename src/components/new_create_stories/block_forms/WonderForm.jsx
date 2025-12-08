import React from 'react'
import { SelectTypeForm } from './SelectTypeForm'
import WonderIcon from "../../../assets/wonder.svg"


export function WonderForm({ cardIndex, blockIndex, register, errors, globalMentor, globalSoftskill, showTypeSelector,
  value, onSelect, imagePreviews
}) {
  return (
    <div className=' p-3 bg-gray-50 shadow rounded-2xl border-[5px] border-[#B7880E]'>
      <div className="flex justify-center">
        <img src={WonderIcon} alt="" className='h-6 md:h-8' />
      </div>
      <div className='py-2 border-b-2 border-[#6A4E04]'>
        <input
          type="text"
          id="title"
          placeholder="INSERT HERE A TITLE IF YOU WISH"
          {...register(`cards.${cardIndex}.blocks.${blockIndex}.title`)}
          className="w-full bg-transparent border-none py-0 font-semibold text-center
                     focus:outline-none focus:ring-0 focus:shadow-none text-lg
                     text-[#6A4E04] placeholder-gray-400"
        />
        {errors.cards?.blocks?.title && (
          <p className="text-red-500 text-sm mt-1">{errors.cards?.blocks?.title.message}</p>
        )}
      </div>
      {imagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image`] ? (
        <div className='col-span-2 md:col-span-4 flex items-center justify-center py-3 border-b-2 border-[#6A4E04]'>
          <img
            src={imagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image`]}
            alt="Preview"
            className='max-h-[400px] rounded-lg'
          />
        </div>
      ) : (
        <div></div>
      )}
      <div className='bg-[#D6BF8E] py-3 rounded-b-lg mt-3'>
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
      {showTypeSelector &&
        <div className='text-gray-500 pb-1 border-t-2 border-gray-200'>
          <SelectTypeForm value={value} onSelect={onSelect} size='small' />
        </div>}
    </div>
  )
}
