import React from 'react'
import { Controller } from 'react-hook-form'
import { Select } from 'flowbite-react'


export function FactBlockForm({ control, currentCardIndex, currentBlockIndex, register, setImagePreviews, setValue,
  imagePreviews, errors }) {

  console.log("Initial Errors:", errors);
  return (
    <div>
      <div className='font-semibold pb-1'>This is a: <span className='text-red-500'>*</span></div>
      <Controller
        control={control}
        name={`cards.${currentCardIndex}.blocks.${currentBlockIndex}.content_class`}
        rules={{ required: true }}
        render={({ field }) => (
          <Select {...field}
            value={field.value || "FACT"}
            onChange={(e) => field.onChange(e.target.value)}>
            <option value="FACT">Fact</option>
            <option value="MYTH">Myth</option>
            <option value="OPINION">Opinion</option>
          </Select>
        )}
      />
      {errors.cards?.[currentCardIndex]?.blocks?.[currentBlockIndex]?.content_class &&
        <p className="text-red-500">{errors.cards?.[currentCardIndex]?.blocks?.[currentBlockIndex]?.content_class.message}</p>}
    </div>
  )
}
