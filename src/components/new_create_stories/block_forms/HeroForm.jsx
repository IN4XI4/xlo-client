import React, { useEffect, useMemo, useState } from 'react'
import { SelectTypeForm } from './SelectTypeForm'
import { getMyAvatar } from '../../../api/avatar.api';
import { AvatarRenderer } from '../../profile/avatar/AvatarRenderer';


export function HeroForm({ cardIndex, blockIndex, register, errors, globalMentor, globalSoftskill, showTypeSelector,
  value, onSelect, imagePreviews
}) {
  const [myAvatar, setMyAvatar] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    loadMyAvatar();
  }, []);

  async function loadMyAvatar() {
    try {
      const response = await getMyAvatar();
      setMyAvatar(response.data);
    } catch (error) {
      setError(error);
    }
  }

  const name = `cards.${cardIndex}.blocks.${blockIndex}.content`;
  const reg = register(name, { required: "Content is required" });
  const autosize = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const renderAvatar = useMemo(() => myAvatar, [myAvatar]);
  const color = globalSoftskill?.color || "#3DB1FF";
  return (
    <div className=' p-3 bg-gray-50 shadow rounded-2xl border-[4px]' style={{ borderColor: color }}>
      <div className='flex items-center justify-center'>
        <div className='md:px-3'>
          <AvatarRenderer avatar={renderAvatar} size="h-40" />
        </div>
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
      {showTypeSelector &&
        <div className='text-gray-500 pb-1 border-t-2 border-gray-200'>
          <SelectTypeForm value={value} onSelect={onSelect} size='small' />
        </div>}
    </div>
  )
}
