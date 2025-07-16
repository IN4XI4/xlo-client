import React from 'react'


export function SelectCategories({ categories, selectedCategoryIds, onChange }) {
  const toggleCategory = (id) => {
    const updated = selectedCategoryIds.includes(id)
      ? selectedCategoryIds.filter((catId) => catId !== id)
      : [...selectedCategoryIds, id];
    onChange(updated);
  };
  
  const toggleSelectAll = () => {
    const updated = selectedCategoryIds.length === categories.length ? [] : categories.map((cat) => cat.id);
    onChange(updated);
  };

  return (
    <div>
      <div className='text-gray-500 py-3'>
        Choose which categories your space belongs
      </div>
      <div className='border rounded shadow'>
        <div className='bg-gray-100 py-4 text-gray-500 font-semibold ps-4'>
          Pick at least one [category]
        </div>
        {categories.length > 0 && (
          <div className='py-3'>
            <div className='pb-2 border-b mx-3 my-2'>
              <div className={`py-2 rounded-lg cursor-pointer border-2 text-center font-semibold max-w-[500px]
                ${selectedCategoryIds.length === categories.length
                  ? 'bg-[#3DB1FF] text-white border-gray-200'
                  : 'bg-gray-100 text-[#3DB1FF] border-[#3DB1FF]'
                }`}
                onClick={toggleSelectAll}
              >
                Select all categories
              </div>
            </div>
            {categories.map((category) => {
              const isSelected = selectedCategoryIds.includes(category.id);
              return (
                <div
                  key={category.id}
                  className={`mx-3 my-2 py-1 rounded-lg cursor-pointer max-w-[500px] border-2 text-center ${isSelected
                    ? 'bg-[#3DB1FF] text-white border-gray-200'
                    : 'bg-gray-100 text-[#3DB1FF] border-[#3DB1FF]'
                    }`}
                  onClick={() => toggleCategory(category.id)}
                >
                  {category.name}
                </div>
              );
            })}
          </div>
        )}
      </div>
      <div className='text-center text-gray-500 py-3 border-b'>
        You can change this later
      </div>
    </div>
  )
}
