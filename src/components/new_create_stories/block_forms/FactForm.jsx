
import React, { useState } from 'react'
import { SelectTypeForm } from './SelectTypeForm'
import { RiQuestionnaireFill } from 'react-icons/ri'


export function FactForm({ cardIndex, blockIndex, register, errors, globalMentor, globalSoftskill, showTypeSelector,
  value, onSelect, imagePreviews, setValue
}) {
  const color = globalSoftskill?.color || "#3DB1FF";
  const [selectedType, setSelectedType] = useState('')
  const classField = `cards.${cardIndex}.blocks.${blockIndex}.content_class`

  const name = `cards.${cardIndex}.blocks.${blockIndex}.content`;
  const reg = register(name, { required: "Content is required" });
  const autosize = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };


  const handleButtonClick = (newClass) => {
    setSelectedType(newClass)
    setValue(classField, newClass, {
      shouldDirty: true,
      shouldValidate: true,
    })
  }
  return (
    <div className=' p-3 bg-gray-50 shadow rounded-2xl border-[4px]' style={{ borderColor: color }}>
      <div className=''>
        <textarea
          id="content"
          placeholder="Insert content here *"
          {...reg}
          ref={(el) => {
            reg.ref(el);
            if (!el) return;
            requestAnimationFrame(() => autosize(el));
          }}
          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 focus:shadow-none py-0"
          rows={3}
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
        <div className='flex items-center justify-center py-3 border-t-2' style={{ borderColor: color }}>
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
      justify-center" style={{ borderColor: color }}>
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
