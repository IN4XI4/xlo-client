import React, { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import { FaRegCircleXmark } from 'react-icons/fa6';

import { ListAddSpaces } from './ListAddSpaces';
import { getMySpaces } from '../../../api/spaces.api';


export function AddToSpaceModal({ onCancel, onConfirm, initialAddedSpaceIds = [] }) {
  const [spaces, setSpaces] = useState([]);
  const [error, setError] = useState(null);
  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [addedSpaces, setAddedSpaces] = useState([]);
  
  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchText(inputText);
    }
  };

  const handleAddSpace = (space) => {
    setAddedSpaces((prev) => [...prev, { id: space.id, name: space.name }]);
  };

  const handleRemoveSpace = (id) => {
    setAddedSpaces((prev) => prev.filter((space) => space.id !== id));
  };

  const handleCancel = () => {
    onConfirm(addedSpaces);
    onCancel();
  };

  useEffect(() => {
    loadSpaces(initialAddedSpaceIds);
  }, []);

  useEffect(() => {
    loadSpaces();
  }, [searchText]);

  async function loadSpaces(initialIds = null) {
    try {
      const res = await getMySpaces(searchText);
      setSpaces(res.data)
      if (initialIds) {
        const initiallyAddedSpaces = res.data.filter(space =>
          initialIds.includes(space.id)
        ).map(space => ({
          id: space.id,
          name: space.name,
        }));
        setAddedSpaces(initiallyAddedSpaces);
      }

    } catch (error) {
      setError(error);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center z-50" onClick={handleCancel}>
      <div className="bg-white px-3 md:px-4 py-4 rounded-lg shadow-lg text-center w-11/12 md:w-1/3 my-3 overflow-y-auto"
        onClick={handleModalClick}>
        <div className='flex justify-between border-b pb-3 md:pb-4'>
          <div className='flex-1 text-[#43B29D] font-semibold'>
            Add your story to space(s)
          </div>
          <div className='text-gray-500 flex justify-end cursor-pointer hover:text-gray-600' onClick={handleCancel}>
            <FaRegCircleXmark className='text-2xl' />
          </div>
        </div>
        <div className='py-3 border-b relative w-full'>
          <input type="text"
            placeholder="Search by name"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="w-full px-4 py-2 border border-gray-300 rounded-full" />
          <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            onClick={() => setSearchText(inputText)} />
        </div>
        <div className='flex flex-wrap text-sm text-gray-500 py-2 border-b'>
          {addedSpaces.map((space) => {
            return (
              <div key={space.id}
                className='px-3 rounded-full border border-[#3DB1FF] my-1 py-1 me-1 flex justify-between items-center'>
                <div>
                  {space.name}
                </div>
                <FaRegCircleXmark className='ms-2 text-base cursor-pointer text-[#3DB1FF]'
                  onClick={() => handleRemoveSpace(space.id)} />
              </div>
            )
          })}
        </div>
        <ListAddSpaces
          spaces={spaces}
          addedSpaces={addedSpaces}
          onAdd={handleAddSpace}
          onRemove={handleRemoveSpace}
        />
      </div>
    </div>
  )
}
