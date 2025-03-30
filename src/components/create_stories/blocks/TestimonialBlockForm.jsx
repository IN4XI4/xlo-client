import React, { useEffect, useState } from 'react'
import { useWatch } from 'react-hook-form';
import { FaRegCircle } from 'react-icons/fa6';
import { FaDotCircle } from 'react-icons/fa';

import { getUserProfileColors } from '../../../api/users.api';


export function TestimonialBlockForm({
  control,
  register,
  currentCardIndex,
  currentBlockIndex,
  setValue,
  errors, }) {
  const [profileColors, setProfileColors] = useState([]);
  const [selectedProfileColor, setSelectedProfileColor] = useState("");

  const observedBlockColor = useWatch({
    control,
    name: `cards.${currentCardIndex}.blocks.${currentBlockIndex}.block_color`,
  });

  useEffect(() => {
    async function loadProfileColors() {
      try {
        const res = await getUserProfileColors();
        setProfileColors(res.data);
      } catch (error) {
        console.error("Error loading profile colors:", error);
      }
    }
    loadProfileColors();
  }, []);

  useEffect(() => {
    setSelectedProfileColor(observedBlockColor);
  }, [observedBlockColor]);

  const handleProfileColorChange = (colorId, colorCode) => {
    if (colorId === observedBlockColor) return;
    setValue(`cards.${currentCardIndex}.blocks.${currentBlockIndex}.block_color`, colorId, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue(`cards.${currentCardIndex}.blocks.${currentBlockIndex}.block_color_string`, colorCode, {
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
                onClick={() => handleProfileColorChange(color.id, color.color)} />
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
