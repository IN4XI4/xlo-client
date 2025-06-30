import React, { useState } from 'react'
import { RocketIcon } from '../../illustrations/icons/RocketIcon'
import { FaMinus, FaPlus, FaUsers } from 'react-icons/fa6'


export function ListAddSpaces({ spaces, addedSpaces, onAdd, onRemove }) {

  return (
    <div className='ps-1'>
      {spaces.map((space) => {
        
        const isAdded = addedSpaces.some((added) => added.id === space.id);

        return (
          <div key={space.id} className='border-b'>
            <div className={`flex justify-between items-center my-2 ps-1 pe-2
              ${isAdded ? 'bg-[#ECF7FF] rounded-lg' : ''}`}>
              <div className='flex truncate items-center '>
                <div className='rounded-full flex items-center justify-center h-14 w-14 flex-shrink-0'>
                  {space.image ? (
                    <img
                      src={space.image}
                      alt="Profile"
                      className="h-14 w-14 border-2 rounded-full cursor-pointer"
                    />
                  ) : space.id ? (
                    <RocketIcon
                      color={space.color_name}
                      className={"h-12 w-12 cursor-pointer"}
                    />
                  ) : (
                    <img src={logo} alt="" />
                  )}
                </div>
                <div className='truncate text-start ps-2 text-gray-500'>
                  <div className='font-semibold'>{space.name}</div>
                  <div className='truncate text-sm'>{space.description}</div>
                  <div className='flex items-center text-sm text-gray-400'>
                    <FaUsers />
                    <span className='ps-1'>
                      {space.members_count} | #{space.slug}:mixelo.io
                    </span>
                  </div>
                </div>
              </div>
              <div className="">
                {!isAdded ? (
                  <FaPlus
                    className="text-[#3DB1FF] cursor-pointer text-xl"
                    onClick={() => onAdd(space)}
                  />
                ) : (
                  <FaMinus
                    className="text-[#3DB1FF] cursor-pointer text-xl"
                    onClick={() => onRemove(space.id)}
                  />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
