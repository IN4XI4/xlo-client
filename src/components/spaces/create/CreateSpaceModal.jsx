import React, { useEffect, useState } from 'react'
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { FaRegCircleXmark } from 'react-icons/fa6';
import { SelectCategories } from './SelectCategories';
import { FaArrowRight } from "react-icons/fa6";
import { CreateSpaceForm } from './CreateSpaceForm';
import { getTopicTags } from '../../../api/base.api';
import { getUserProfileColors } from '../../../api/users.api';


export function CreateSpaceModal({ onCancel }) {
  const [page, setPage] = useState(1);
  const [allCategories, setAllCategories] = useState([]);
  const [allColors, setAllColors] = useState([]);
  const [newSpaceData, setNewSpaceData] = useState({
    isPrivate: false,
    categoryIds: [],
  });

  useEffect(() => {
    if (allCategories.length === 0) {
      loadCategories();
    }
    if (allColors.length === 0) {
      loadProfileColors();
    }
  }, []);

  const loadCategories = async () => {
    try {
      const response = await getTopicTags();
      setAllCategories(response.data.results);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProfileColors = async () => {
    try {
      const response = await getUserProfileColors();
      setAllColors(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  const updatePrivacy = (isPrivate) => {
    setNewSpaceData((prev) => ({ ...prev, isPrivate }));
  };

  const updateCategories = (categoryIds) => {
    setNewSpaceData((prev) => ({ ...prev, categoryIds }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center  z-50" onClick={onCancel}>
      <div className="bg-white px-4 md:px-6 py-4 rounded-lg shadow-lg text-center w-11/12 md:w-1/3 my-3 overflow-y-auto"
        onClick={handleModalClick}>
        <div className='flex justify-between border-b pb-3 md:pb-4'>
          <div className='flex-1 text-[#3DB1FF] font-semibold'>
            Create a space
          </div>
          <div className='text-gray-500 flex justify-end cursor-pointer hover:text-gray-600' onClick={onCancel}>
            <FaRegCircleXmark className='text-2xl' />
          </div>
        </div>
        {page === 1 && (
          <>
            <div className='text-center py-3 text-gray-500'>
              What type of space do you want to create?
            </div>
            <div className='grid justify-center pt-2 pb-4 border-b'>
              <div className='flex items-center justify-between text-sm mb-4'>
                <div
                  className={`flex w-24 py-1 items-center justify-center rounded text-white cursor-pointer
                    ${!newSpaceData.isPrivate ? 'bg-[#3DB1FF]' : 'bg-gray-200'}`}
                  onClick={() => updatePrivacy(false)}
                >
                  <FaLockOpen />
                  <span className='ps-2'>Public</span>
                </div>
                <div className='flex-grow ps-2 text-start text-gray-500'>Open to anyone, best for communities</div>
              </div>
              <div className='flex items-center justify-between text-sm'>
                <div
                  className={`flex w-24 py-1 items-center justify-center rounded text-white cursor-pointer
                    ${newSpaceData.isPrivate ? 'bg-[#3DB1FF]' : 'bg-gray-200'}`}
                  onClick={() => updatePrivacy(true)}
                >
                  <FaLock />
                  <span className='ps-2'>Private</span>
                </div>
                <div className='flex-grow ps-2 text-start text-gray-500'>Invite only, best for yourself or teams</div>
              </div>
            </div>

            <SelectCategories
              categories={allCategories}
              selectedCategoryIds={newSpaceData.categoryIds}
              onChange={updateCategories}
            />

            <div className='flex justify-end pt-3'>
              <div
                className='flex justify-center items-center bg-[#3DB1FF] px-4 rounded-lg text-white py-1 cursor-pointer'
                onClick={() => setPage(2)}
              >
                <FaArrowRight /> <span className='ps-2'>Next</span>
              </div>
            </div>
          </>
        )}

        {page === 2 && (
          <CreateSpaceForm
            profileColors={allColors}
            newSpaceData={newSpaceData}
            setNewSpaceData={setNewSpaceData}
            setPage={setPage}
            onCancel={onCancel} />
        )}
      </div>
    </div>
  )
}
