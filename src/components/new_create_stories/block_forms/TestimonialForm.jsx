import React, { useEffect, useMemo, useState } from 'react'
import { SelectTypeForm } from './SelectTypeForm'
import { getUserProfileColors } from '../../../api/users.api';
import { FaDotCircle, FaRegCircle } from 'react-icons/fa';


export function TestimonialForm({ cardIndex, blockIndex, register, errors, globalMentor, globalSoftskill, showTypeSelector,
  value, onSelect, imagePreviews, setValue
}) {
  const [profileColors, setProfileColors] = useState([]);
  const [selectedTestimonialColor, setSelectedTestimonialColor] = useState(null);
  const [error, setError] = useState([]);

  const name = `cards.${cardIndex}.blocks.${blockIndex}.content`;
  const reg = register(name, { required: "Content is required" });
  const autosize = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    loadProfileColors();
  }, []);

  async function loadProfileColors() {
    try {
      const res = await getUserProfileColors();
      setProfileColors(res.data);
      if (res.data.length > 0) {
        setSelectedTestimonialColor(res.data[0].id);
      }
    } catch (error) {
      setError(error);
    }
  }

  const handleProfileColorChange = async (color) => {
    if (color.id === selectedTestimonialColor) {
      return;
    }
    setSelectedTestimonialColor(color.id);
    setValue(
      `cards.${cardIndex}.blocks.${blockIndex}.block_color`,
      color.id,
      { shouldDirty: true, shouldTouch: true }
    );
  };

  const selectedColor = useMemo(
    () => profileColors.find((c) => c.id === selectedTestimonialColor),
    [profileColors, selectedTestimonialColor]
  );
  return (
    <div>
      <div className='p-3 shadow rounded-2xl border-[4px]'
        style={{ backgroundColor: selectedColor?.color || '#F9FAFB', borderColor: `${selectedColor?.color || "#3DB1FF"}66` }} >
        <div className=''>
          <textarea
            placeholder="Insert content here *"
            {...reg}
            ref={(el) => {
              reg.ref(el);
              if (!el) return;
              requestAnimationFrame(() => autosize(el));
            }}
            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 focus:shadow-none py-0 text-white placeholder-white"
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
          <div className='flex items-center justify-center py-3 border-t-2'
            style={{ borderColor: `${selectedColor?.color || "#3DB1FF"}66` }}>
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
      <div className='flex justify-end gap-2 pt-2'>
        {profileColors && profileColors.map((color, index) => {
          const isCurrentColor = color.id === selectedTestimonialColor;
          const Icon = isCurrentColor ? FaDotCircle : FaRegCircle;
          return (
            <Icon
              key={index}
              className='cursor-pointer'
              style={{ color: color.color }}
              onClick={() => handleProfileColorChange(color)} />
          );
        })}
      </div>
    </div>
  )
}
