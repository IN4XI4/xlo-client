
import React, { useState } from 'react'
import { SelectTypeForm } from './SelectTypeForm'
import { RiQuestionnaireFill } from 'react-icons/ri'


export function FactForm({ cardIndex, blockIndex, register, errors, globalMentor, globalSoftskill, showTypeSelector,
  value, onSelect, imagePreviews, setValue
}) {
  const [selectedType, setSelectedType] = useState('')
  const classField = `cards.${cardIndex}.blocks.${blockIndex}.content_class`

  const handleButtonClick = (newClass) => {
    setSelectedType(newClass)
    setValue(classField, newClass, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }
  return (
    <div className=' p-3 bg-gray-50 shadow rounded-2xl border-[4px]'>
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
      <div className="my-3 border-t-2 flex space-x-2 text-white pt-3 items-center flex-wrap text-sm md:text-base
      justify-center">
        <div className={`flex p-2 rounded-full cursor-pointer 
        ${selectedType === "FACT" ? "bg-[#3DB1FF]" : "bg-[#50326C]"}`}
          onClick={() => handleButtonClick("FACT")}>
          FACT <span className="ps-2"><RiQuestionnaireFill /></span>
        </div>
        <div className={`flex p-2 rounded-full cursor-pointer 
        ${selectedType === "MYTH" ? "bg-[#3DB1FF]" : "bg-[#50326C]"}`}
          onClick={() => handleButtonClick("MYTH")}>
          MYTH <span className="ps-2"><RiQuestionnaireFill /></span>
        </div>
        <div className={`flex p-2 rounded-full cursor-pointer 
        ${selectedType === "OPINION" ? "bg-[#3DB1FF]" : "bg-[#50326C]"}`}
          onClick={() => handleButtonClick("OPINION")}>
          OPINION <span className="ps-2"><RiQuestionnaireFill /></span>
        </div>
      </div>
      {showTypeSelector &&
        <div className='text-gray-500 pb-1 border-t-2 border-gray-200'>
          <SelectTypeForm value={value} onSelect={onSelect} size='small' />
        </div>}
    </div>
  )
}
