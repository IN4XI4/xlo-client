import React, { useMemo } from 'react'
import { SelectTypeForm } from './SelectTypeForm';
import { useWatch } from 'react-hook-form';


export function IllustrationForm({ cardIndex, blockIndex, register, errors, globalMentor, globalSoftskill, showTypeSelector,
  value, onSelect, imagePreviews, setImagePreviews, setValue, control
}) {
  const color = globalMentor?.color || "#3DB1FF";
  const name = `cards.${cardIndex}.blocks.${blockIndex}.content`;

  const contentValue = useWatch({ control, name }) || "";

  const rows = useMemo(() => {
    const lines = contentValue.split("\n").length;
    return Math.min(20, Math.max(3, lines));
  }, [contentValue]);

  const handleAddImage = () => {
    const fileInput = document.querySelector(`input[name='cards.${cardIndex}.blocks.${blockIndex}.image']`);
    if (fileInput) {
      fileInput.click();
      fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const fileData = reader.result;
            setImagePreviews(prev => ({
              ...prev,
              [`cards.${cardIndex}.blocks.${blockIndex}.image`]: fileData
            }));
            setValue(`cards.${cardIndex}.blocks.${blockIndex}.image`, file, {
              shouldDirty: true,
              shouldTouch: true
            });
          };
          reader.readAsDataURL(file);
        } else {
          console.warn("No file selected.");
        }
      }, { once: true });
    } else {
      console.error("File input not found.");
    }
  };

  return (
    <div className='p-3 bg-gray-50 shadow rounded-2xl border-[4px]' style={{ borderColor: color }}>
      <div className=''>
        {imagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image`] ? (
          <div className='flex items-center justify-center py-3'>
            <img
              src={imagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image`]}
              alt="Preview"
              className='max-h-[400px] rounded-lg cursor-pointer'
              onClick={handleAddImage}
            />
          </div>
        ) : (
          <div className='h-[300px] flex justify-center items-center text-gray-500 my-2 bg-gray-200 rounded-t-lg cursor-pointer'
          onClick={handleAddImage}>
            Insert image here *
          </div>
        )}
        <div className='border-t-2 pt-2' style={{ borderColor: color }}>
          <textarea
            id="content"
            placeholder="Insert content here *"
            {...register(`cards.${cardIndex}.blocks.${blockIndex}.content`, { required: "Content is required" })}
            className="w-full bg-transparent border-none focus:outline-none focus:ring-0 focus:shadow-none py-1"
            rows={rows}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />
          {errors.cards?.blocks?.content && (
            <p className="text-red-500 text-sm mt-1">{errors.cards?.blocks?.content.message}</p>
          )}
        </div>

      </div>

      {showTypeSelector &&
        <div className='text-gray-500 pb-1 border-t-2 border-gray-200'>
          <SelectTypeForm value={value} onSelect={onSelect} size='small' />
        </div>}
      <div>
      </div>
    </div>
  )
}
