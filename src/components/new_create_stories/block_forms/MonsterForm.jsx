import React from 'react'
import { SelectTypeForm } from './SelectTypeForm'
import { FaUser } from 'react-icons/fa';


export function MonsterForm({ cardIndex, blockIndex, register, errors, globalMentor, globalSoftskill, showTypeSelector,
  value, onSelect, imagePreviews
}) {
  const color = globalSoftskill?.color || "#3DB1FF";
  const monster_name = globalSoftskill?.monster_name;
  const soft_skill_name = globalSoftskill?.name;
  const monster_image = globalSoftskill?.monster_picture;

  return (
    <div>
      <div className='pb-1 flex justify-end items-center'>
        <div className='text-end text-sm md:text-base'>
          <div className='font-bold'>{monster_name}</div>
          <div className='text-gray-500'>{soft_skill_name}</div>
        </div>
        <div className=' flex-none'>
          {monster_image ? (
            <img src={monster_image} alt="Monster"
              className="h-10 w-10 md:h-14 md:w-14 rounded-full ms-2 border-[3px] cursor-pointer"
              style={{ borderColor: color }}
              onClick={() => { }} />
          ) : <FaUser />}
        </div>
      </div>
      <div className=' p-3 bg-gray-50 shadow rounded-2xl border-[4px] rounded-tr-none me-4 md:me-6'
        style={{ borderColor: color }}>
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
