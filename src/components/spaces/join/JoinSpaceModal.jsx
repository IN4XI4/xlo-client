import React, { useEffect, useState } from 'react'
import { FaRegCircleXmark } from 'react-icons/fa6';
import { getSpaces } from '../../../api/spaces.api';
import { FaPlus, FaSearch } from 'react-icons/fa';
import { ListSpaces } from './ListSpaces';


export function JoinSpaceModal({ onCancel, user, onOpenCreate }) {
  const [spaces, setSpaces] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadSpaces(1);
  }, [searchText]);

  useEffect(() => {
    loadSpaces(currentPage);
  }, [currentPage]);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchText(inputText);
      setCurrentPage(1);
    }
  };

  async function loadSpaces(page) {
    try {
      const res = await getSpaces(page, 15, searchText);

      if (page === 1) {
        setSpaces(res.data.results);
      } else {
        setSpaces(prevSpaces => [...prevSpaces, ...res.data.results]);
      }

      setHasMore(!!res.data.next);
      if (page === 1) {
        setCurrentPage(1);
      }
    } catch (error) {
      setError(error);
      setHasMore(false);
    }
  }

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center z-50" onClick={onCancel}>
      <div className="bg-white px-3 md:px-4 py-4 rounded-lg shadow-lg text-center w-11/12 md:w-1/3 my-3 overflow-y-auto"
        onClick={handleModalClick}>
        <div className='flex justify-between border-b pb-3 md:pb-4'>
          <div className='flex-1 text-[#43B29D] font-semibold'>
            Join an existing space
          </div>
          <div className='text-gray-500 flex justify-end cursor-pointer hover:text-gray-600' onClick={onCancel}>
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
        {user.is_creator && (
          <div className='flex items-center border-b py-2'>
            <div className='flex rounded-full items-center p-2 bg-[#3DB1FF] text-white cursor-pointer'
              onClick={onOpenCreate}>
              <FaPlus />
            </div>
            <div className='ps-1 text-[#3DB1FF] font-semibold cursor-pointer' onClick={onOpenCreate}>
              Create a space
            </div>
          </div>
        )}
        <ListSpaces spaces={spaces} setSpaces={setSpaces} hasMore={hasMore} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  )
}
