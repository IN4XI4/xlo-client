import React from 'react'
import { SelectTypeForm } from './SelectTypeForm';

export function StandardForm({ cardIndex, blockIndex, register, errors, globalMentor, globalSoftskill, showTypeSelector,
  value, onSelect, imagePreviews
}) {
  const color = globalMentor?.color || "#3DB1FF";
  return (
    <div className='p-3 bg-gray-50 shadow rounded-2xl border-[4px]' style={{ borderColor: color }}>
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
      <div>

      </div>
    </div>
  )
}
