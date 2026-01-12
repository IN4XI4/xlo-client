import React, { useEffect, useState } from 'react'
import { SelectTypeForm } from './SelectTypeForm'
import { IoSync } from 'react-icons/io5';


export function FlashcardForm({ cardIndex, blockIndex, register, errors, globalMentor, globalSoftskill, showTypeSelector,
  value, onSelect, imagePreviews, setValue
}) {
  const [isPrimaryActive, setIsPrimaryActive] = useState(true);
  const color = globalSoftskill?.color || "#3DB1FF";
  useEffect(() => {
    setValue(
      `cards.${cardIndex}.blocks.${blockIndex}.isPrimaryActive`,
      isPrimaryActive,
      { shouldDirty: true, shouldTouch: true }
    );
  }, [isPrimaryActive, cardIndex, blockIndex, setValue]);

  const name = `cards.${cardIndex}.blocks.${blockIndex}.content`;
  const name2 = `cards.${cardIndex}.blocks.${blockIndex}.content_2`;
  const reg = register(name, { required: "Content is required" });
  const reg2 = register(name2, { required: "Content is required" });
  const autosize = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const toggleContent = () => {
    setIsPrimaryActive((prev) => !prev);
  };

  return (
    <div className=' p-3 bg-gray-50 shadow rounded-2xl border-[4px]' style={{ borderColor: color }}>
      {isPrimaryActive ? (
        <React.Fragment key="front">
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
            <div className='flex items-center justify-center py-3 border-t-2'  style={{ borderColor: color }}>
              <img
                src={imagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image`]}
                alt="Preview"
                className='max-h-[400px] rounded-lg'
              />
            </div>
          ) : (
            <div></div>
          )}
        </React.Fragment>
      ) : (
        <React.Fragment key="back">
          <div className=''>
            <textarea
              id="content_2"
              placeholder="Insert content here"
              {...reg2}
              ref={(el) => {
                reg2.ref(el);
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
            {errors.cards?.blocks?.content_2 && (
              <p className="text-red-500 text-sm mt-1">{errors.cards?.blocks?.content_2.message}</p>
            )}
          </div>
          {imagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image_2`] ? (
            <div className='flex items-center justify-center py-3 border-t-2'  style={{ borderColor: color }}>
              <img
                src={imagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image_2`]}
                alt="Preview"
                className='max-h-[400px] rounded-lg'
              />
            </div>
          ) : (
            <div></div>
          )}
        </React.Fragment>
      )}
      <div className="flex justify-end items-center pb-2">
        <div
          className={`h-4 w-4 rounded-full me-2 cursor-pointer ${isPrimaryActive ? "bg-[#3DB1FF]" : "bg-gray-300"
            }`}
          onClick={() => setIsPrimaryActive(true)}
        ></div>
        <div
          className={`h-4 w-4 rounded-full me-2 cursor-pointer ${!isPrimaryActive ? "bg-[#3DB1FF]" : "bg-gray-300"
            }`}
          onClick={() => setIsPrimaryActive(false)}
        ></div>
        <div className="bg-[#3DB1FF] text-white text-xl rounded-full p-1 font-bold cursor-pointer"
          onClick={toggleContent}>
          <IoSync />
        </div>
      </div>
      {showTypeSelector &&
        <div className='text-gray-500 pb-1 border-t-2 border-gray-200'>
          <SelectTypeForm value={value} onSelect={onSelect} size='small' />
        </div>}
    </div>
  )
}

