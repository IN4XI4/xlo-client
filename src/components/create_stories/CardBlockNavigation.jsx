import React from 'react';
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

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
    <div className='flex items-center justify-between'>
      <div className='flex justify-between items-center'>
        <button type="button"
          className='bg-[#3DB1FF] p-2 rounded-full text-white flex items-center'
          disabled={currentBlockIndex === 0} onClick={handlePreviousBlock}>
          <FaAngleLeft />
        </button>
        <div className='text-sm text-[#3DB1FF] font-semibold px-2'>
          {currentBlockIndex + 1} - {fields[currentCardIndex].blocks.length}
        </div>
        <button type="button"
          className='bg-[#3DB1FF] p-2 rounded-full text-white flex items-center'
          disabled={currentBlockIndex === fields[currentCardIndex]?.blocks?.length - 1}
          onClick={handleNextBlock}>
          <FaAngleRight />
        </button>
      </div>
      <div className='flex justify-end'>
        {fields[currentCardIndex].blocks.length > 1 && (
          <button type="button" onClick={() => handleRemoveBlock(currentCardIndex, currentBlockIndex)}
            className="bg-[#FD4E3F] p-2 rounded-full text-white flex items-center me-3">
            <FaMinusCircle />
          </button>
        )}
        <button type="button" onClick={() => {
          const currentCards = getValues(`cards`);
          currentCards[currentCardIndex].blocks.push({ content: '', blockType: '' });
          setValue(`cards`, currentCards);
          setCurrentBlockIndex(currentCards[currentCardIndex].blocks.length - 1);
        }} className="bg-[#5B0FFE] p-2 rounded-full text-white flex items-center">
          <FaPlusCircle />
        </button>
      </div>
    </div>
  );
}
