import React, { useState } from 'react';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import SortIcon from '../../assets/assessments/Sort.svg';
import FilterIcon from '../../assets/assessments/Filter.svg';
import { FilterPanel } from './AssessmentsFilterPanel';

export function AssessmentsFilterBar(props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden pt-6 md:pt-0">
      <div
        className={`flex items-center bg-white px-5 py-3 cursor-pointer select-none transition-[border-radius] duration-300 ${open ? 'rounded-t-3xl' : 'rounded-full'}`}
        onClick={() => setOpen(o => !o)}
      >
        <div className="flex items-center gap-2 mr-5">
          <FaSearch className="text-gray-700 text-lg" />
          <div className="font-semibold text-gray-700">Search</div>
        </div>
        <div className="flex items-center gap-2 mr-5">
          <img src={SortIcon} className="w-5 h-5" alt="" />
          <div className="font-semibold text-gray-700">Sort</div>
        </div>
        <div className="flex items-center gap-2 flex-1">
          <img src={FilterIcon} className="w-5 h-5" alt="" />
          <div className="font-semibold text-gray-700">Filter</div>
        </div>
        <div className="bg-gray-200 rounded-full p-2 flex-shrink-0">
          <FaChevronDown className={`text-gray-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white rounded-b-xl">
          <FilterPanel {...props} />
        </div>
      </div>
    </div>
  );
}
