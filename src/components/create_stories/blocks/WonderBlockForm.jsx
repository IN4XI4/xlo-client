import React from 'react'
import { TextInput } from 'flowbite-react'


export function WonderBlockForm({ currentCardIndex, currentBlockIndex, register, errors }) {
  return (
    <div>
      <div className="font-semibold pb-2">
        Title <span className='text-red-500'>*</span>
      </div>
      <div className='py-3'>
        <TextInput
          placeholder='Insert a title here'
          id="block_title"
          {...register(`cards.${currentCardIndex}.blocks.${currentBlockIndex}.title`, { required: "Title is required."})} />
        {errors.cards?.[currentCardIndex]?.blocks?.[currentBlockIndex]?.title &&
          <p className="text-red-500 pb-2 ps-2">{errors.cards?.[currentCardIndex]?.blocks?.[currentBlockIndex]?.title.message}</p>}
      </div>
    </div>
  )
}
