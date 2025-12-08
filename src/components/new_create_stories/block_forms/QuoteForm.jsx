import React from 'react'
import { SelectTypeForm } from './SelectTypeForm'
import { BiSolidQuoteAltLeft, BiSolidQuoteAltRight } from 'react-icons/bi';


export function QuoteForm({ cardIndex, blockIndex, register, errors, globalMentor, globalSoftskill, showTypeSelector,
  value, onSelect, imagePreviews
}) {
  const color = globalMentor?.color || "#3DB1FF";
  return (
    <div className='p-3 bg-[#374151]  shadow rounded-2xl border-[4px]' style={{ borderColor: color }}>
      <div className="flex justify-center text-white text-2xl pb-4">
        <BiSolidQuoteAltLeft />
      </div>
      <div className=''>
        <textarea
          id="content"
          placeholder="Insert quote here *"
          {...register(`cards.${cardIndex}.blocks.${blockIndex}.content`, { required: "Content is required" })}
          className="w-full bg-transparent text-white text-center border-none focus:outline-none focus:ring-0 
          focus:shadow-none py-0 font-semibold"
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
      <div className='text-white text-center'>---</div>
      <div className=''>
        <input
          type='text'
          id="content_2"
          placeholder="Insert here, the [Author-Name]"
          {...register(`cards.${cardIndex}.blocks.${blockIndex}.content_2`, { required: false })}
          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 focus:shadow-none
           text-white py-0 text-center"
        />
        {errors.cards?.blocks?.content_2 && (
          <p className="text-red-500 text-sm mt-1">{errors.cards?.blocks?.content_2.message}</p>
        )}
      </div>
      {imagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image`] ? (
        <div className='flex items-center justify-center py-3'>
          <img
            src={imagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image`]}
            alt="Preview"
            className="h-10 w-10 rounded-full border-[#FFBA0A] border-2"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center py-3">
          <div className='h-10 w-10 rounded-full border-[#FFBA0A] border-2'></div>
        </div>
      )}
      <div className="flex justify-center text-white text-2xl pb-2">
        <BiSolidQuoteAltRight />
      </div>
      {showTypeSelector &&
        <div className='text-gray-500 pb-1 border-t-2 border-gray-200'>
          <SelectTypeForm value={value} onSelect={onSelect} size='small' />
        </div>}
    </div>
  )
}
