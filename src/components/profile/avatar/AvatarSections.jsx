import React, { useState } from 'react'
import { MdWc } from 'react-icons/md'
import { MdFaceRetouchingNatural } from "react-icons/md";
import { GiHairStrands } from "react-icons/gi";
import { IoShirt } from "react-icons/io5";
import { PiPants } from "react-icons/pi";
import { GiSteeltoeBoots } from "react-icons/gi";
import { GiBroadsword } from "react-icons/gi";
import { BsShop } from "react-icons/bs";


const sections = [
  { key: 'GENDER', label: 'Types', icon: <MdWc className="text-4xl" /> },
  { key: 'FACE', label: 'Face', icon: <MdFaceRetouchingNatural className="text-4xl" /> },
  { key: 'HAIR', label: 'Hair', icon: <GiHairStrands className="text-4xl" /> },
  { key: 'SHIRT', label: 'Top', icon: <IoShirt className="text-4xl" /> },
  { key: 'PANTS', label: 'Pants', icon: <PiPants className="text-4xl" /> },
  { key: 'SHOES', label: 'Shoes', icon: <GiSteeltoeBoots className="text-4xl" /> },
  { key: 'ACCESSORY', label: 'Props', icon: <GiBroadsword className="text-4xl" /> },
  { key: 'SHOP', label: 'Shop', icon: <BsShop className="text-4xl" /> },
]

export function AvatarSections({ activeSection, onChange }) {
  const baseClasses = 'rounded-3xl h-24 w-20 flex flex-col items-center justify-center cursor-pointer'

  return (
    <div className="mt-4 grid grid-cols-4 sm:grid-cols-8 gap-y-2 justify-items-center py-3 md:py-4 bg-gray-50 rounded-3xl">
      {sections.map(({ key, label, icon }) => {
        const isActive = activeSection === key
        const borderColor = isActive ? 'bg-[#8BD0FF]' : 'bg-[#D8EFFF]'
        const textColor = isActive ? 'text-white' : 'text-[#3DB1FF]'

        return (
          <div
            key={key}
            className={`${baseClasses} ${borderColor} `}
            onClick={() => onChange(key)}
          >
            <div className='rounded-full p-3 bg-[#3DB1FF] text-white mb-1'>
              {icon}
            </div>
            <div className={`${textColor} font-semibold`}>{label}</div>
          </div>
        )
      })}
    </div>
  )
}
