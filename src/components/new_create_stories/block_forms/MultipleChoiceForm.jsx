import React from 'react'
import { SelectTypeForm } from './SelectTypeForm'


export function MultipleChoiceForm({ cardIndex, blockIndex, register, errors, globalMentor, globalSoftskill, showTypeSelector,
  value, onSelect, imagePreviews
}) {
  return (
    <div className=' p-3 bg-gray-50 shadow rounded-2xl border-[4px]'>
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
  )
}
