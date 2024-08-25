import React from 'react';
import { FaAngleLeft, FaAngleRight, FaMinusCircle, FaPlusCircle } from "react-icons/fa";

export function CardBlockNavigation({
  currentBlockIndex,
  setCurrentBlockIndex,
  currentCardIndex,
  fields,
  handlePreviousBlock,
  handleNextBlock,
  handleRemoveBlock,
  getValues,
  setValue
}) {
  return (
    <div className='md:col-span-5 flex items-center justify-between'>
      <div className='flex justify-between items-center'>
        <button type="button"
          className='bg-[#43B29D] px-2 md:px-3 py-2 rounded-full text-white flex items-center'
          disabled={currentBlockIndex === 0} onClick={handlePreviousBlock}>
          <FaAngleLeft /> <span className='px-1 text-sm md:text-base'>PREV</span>
        </button>
        <div className='text-sm text-[#43B29D] font-semibold px-1'>
          {currentBlockIndex + 1} / {fields[currentCardIndex].blocks.length}
        </div>
        <button type="button"
          className='bg-[#43B29D] px-2 md:px-3 py-2 rounded-full text-white flex items-center'
          disabled={currentBlockIndex === fields[currentCardIndex]?.blocks?.length - 1}
          onClick={handleNextBlock}>
          <span className='px-1 text-sm md:text-base'>NEXT</span><FaAngleRight />
        </button>
      </div>
      <div className='flex justify-end'>
        {fields[currentCardIndex].blocks.length > 1 && (
          <button type="button" onClick={() => handleRemoveBlock(currentCardIndex, currentBlockIndex)}
            className="bg-[#FD4E3F] px-2 md:px-4 py-2 rounded-full md:rounded-lg text-white flex items-center me-3">
            <span className='pe-3 hidden md:block'>DELETE BLOCK</span> <FaMinusCircle />
          </button>
        )}
        <button type="button" onClick={() => {
          const currentCards = getValues(`cards`);
          currentCards[currentCardIndex].blocks.push({ content: '', blockType: '' });
          setValue(`cards`, currentCards);
          setCurrentBlockIndex(currentCards[currentCardIndex].blocks.length - 1);
        }} className="bg-[#43B29D] px-2 md:px-4 py-2 rounded-full md:rounded-lg text-white flex items-center">
          <span className='pe-3 hidden md:block'>ADD NEW BLOCK</span> <FaPlusCircle />
        </button>
      </div>
    </div>
  );
}
