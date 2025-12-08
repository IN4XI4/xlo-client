import React, { useEffect, useState } from 'react'
import { SelectTypeForm } from './SelectTypeForm'
import ReflectionIcon from "../../../assets/reflection.svg"
import FeedbackIcon from "../../../assets/feedback.svg"


export function ReflectionForm({ cardIndex, blockIndex, register, errors, globalMentor, globalSoftskill, showTypeSelector,
  value, onSelect, imagePreviews, setValue
}) {
  const [activeTab, setActiveTab] = useState("reflection");
  const color = globalMentor?.color || "#3DB1FF";

  useEffect(() => {
    setValue(
      `cards.${cardIndex}.blocks.${blockIndex}.isPrimaryActive`,
      activeTab === "reflection" ? true : false,
      { shouldDirty: true, shouldTouch: true }
    );
  }, [activeTab, cardIndex, blockIndex, setValue]);

  return (
    <div className=' p-3 bg-gray-50 shadow rounded-2xl border-[4px]' style={{ borderColor: color }}>
      <div className="flex justify-evenly">
        <div className="flex items-center text-[#657DFF] text-base md:text-xl font-serif italic font-bold cursor-pointer"
          onClick={() => setActiveTab("reflection")}>
          <span className="pe-2 md:pe-3"><img src={ReflectionIcon} alt="" className='h-8 md:h-14 w-8 md:w-14' /></span> Reflection
        </div>
        <div className="flex items-center text-[#38AFFF] text-base md:text-xl font-serif italic font-bold cursor-pointer"
          onClick={() => setActiveTab("feedback")}>
          <span className="pe-2 md:pe-3"><img src={FeedbackIcon} alt="" className='h-8 md:h-14 w-8 md:w-14' /></span> Feedback
        </div>
      </div>
      {activeTab === "reflection" && (
        <>
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
            <div className='flex items-center justify-center py-3'>
              <img
                src={imagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image`]}
                alt="Preview"
                className='max-h-[400px] rounded-lg'
              />
            </div>
          ) : (
            <div></div>
          )}
        </>
      )}
      {activeTab === "feedback" && (
        <>
          <div className=''>
            <textarea
              id="content_2"
              placeholder="Insert content here"
              {...register(`cards.${cardIndex}.blocks.${blockIndex}.content_2`, { required: false })}
              className="w-full bg-transparent border-none focus:outline-none focus:ring-0 focus:shadow-none py-0"
              rows={1}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
            />
            {errors.cards?.blocks?.content_2 && (
              <p className="text-red-500 text-sm mt-1">{errors.cards?.blocks?.content_2.message}</p>
            )}
          </div>
          {imagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image_2`] ? (
            <div className='flex items-center justify-center py-3'>
              <img
                src={imagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image_2`]}
                alt="Preview"
                className='max-h-[400px] rounded-lg'
              />
            </div>
          ) : (
            <div></div>
          )}
        </>
      )}
      {showTypeSelector &&
        <div className='text-gray-500 pb-1 border-t-2 border-gray-200'>
          <SelectTypeForm value={value} onSelect={onSelect} size='small' />
        </div>}
    </div>
  )
}
