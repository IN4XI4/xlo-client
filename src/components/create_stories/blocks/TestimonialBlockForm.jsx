import React, { useEffect, useState } from 'react'
import { getUserProfileColors } from '../../../api/users.api';
import { FaRegCircle } from 'react-icons/fa6';
import { FaDotCircle } from 'react-icons/fa';


export function TestimonialBlockForm({
  blockColor,
  register,
  currentCardIndex,
  currentBlockIndex,
  setValue,
  errors, }) {
  const [profileColors, setProfileColors] = useState([]);
  const [selectedProfileColor, setSelectedProfileColor] = useState(blockColor);
  console.log("color", blockColor);

  async function loadProfileColors() {
    try {
      const res = await getUserProfileColors();
      setProfileColors(res.data);
    } catch (error) {
      setError(error);
    }
  }

  useEffect(() => {
    loadProfileColors();
    setSelectedProfileColor(blockColor);
  }, [blockColor]);

  const handleProfileColorChange = (colorId) => {
    if (colorId === blockColor) return;
    setValue(`cards.${currentCardIndex}.blocks.${currentBlockIndex}.block_color`, colorId, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setSelectedProfileColor(colorId)
  };

  return (
    <div className='grid grid-cols-1 md:grid-cols-3'>
      <div className='md:col-span-2 md:flex md:items-center md:pe-4'>
        <div className='font-bold pb-3 md:pb-0 md:pe-4'>
          Select a background color:
        </div>
        <div className='flex-grow flex justify-between'>
          {profileColors && profileColors.map((color, index) => {
            const isCurrentColor = color.id === selectedProfileColor;
            const Icon = isCurrentColor ? FaDotCircle : FaRegCircle;
            return (
              <Icon
                key={index}
                className='cursor-pointer'
                style={{ color: color.color }}
                onClick={() => handleProfileColorChange(color.id)} />
            );
          })}
        </div>
      </div>

      {errors.cards?.[currentCardIndex]?.blocks?.[currentBlockIndex]?.block_color && (
        <p className="text-red-500">
          {errors.cards[currentCardIndex].blocks[currentBlockIndex].block_color.message}
        </p>
      )}
    </div>
  )
}
