import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { TextInput } from 'flowbite-react';
import { GoArrowUpLeft } from "react-icons/go";
import { FaSearch } from 'react-icons/fa';
import { MyCreatedStoriesList } from '../components/create_stories/MyCreatedStoriesList';


export function MyCreatedStoriesPage() {
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
    <div className="pt-24 md:pt-28 px-4 md:px-16 lg:px-32 xl:px-44">
      <div className='text-2xl md:text-4xl font-extrabold'>
        Vous trouverez ici les histoires
      </div>
      <div className='text-xl py-3'>
        Here you can edit your stories
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
        <MyCreatedStoriesList key="my-created-stories" searchText={searchText}/>
      </div>
    </div>
  )
}
