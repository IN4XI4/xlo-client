import { TextInput } from 'flowbite-react';
import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import { GoArrowUpLeft } from "react-icons/go";
import { Link } from 'react-router-dom'
import { MyStoriesList } from '../components/topics/MyStoriesList';


export function MyNewStoriesPage() {
  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');
  const handleTextInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSearchText(inputText);
    }
  };
  return (
    <div className="pt-20 md:pt-28 px-4 md:px-16 lg:px-32 xl:px-44">
      <div className='text-2xl md:text-4xl font-extrabold'>
        Vous trouverez ici les nouvelles histoires que vous n’auriez pas consulter
      </div>
      <div className='text-xl py-3'>
        Renforcement de la confiance en soi et de la capacité à atteindre les objectifs fixés avec une plus grande assurance et efficacité
      </div>
      <div className='flex items-center py-4 border-b-4 border-[#D9D9D9]'>
        <div className='flex-none pe-2 md:pe-6'>
          <Link to="/">
            <button className="p-2 md:p-3 bg-gray-200 rounded-full border">
              <GoArrowUpLeft className='text-[#6B7280] text-xl' />
            </button>
          </Link>
        </div>
        <div className='grow self-center'>
          <TextInput id="search_story"
            type="text"
            icon={FaSearch}
            placeholder="Quick search for a story"
            color="white"
            value={inputText}
            onChange={handleTextInputChange}
            onKeyDown={handleKeyPress} />
        </div>
      </div>
      <div className='py-4'>
        <MyStoriesList key="my-stories" searchText={searchText}/>
      </div>
    </div>
  )
}
