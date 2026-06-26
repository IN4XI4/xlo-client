import React, { useEffect, useState } from 'react'
import { FaChevronDown, FaFilter, FaSearch, FaSortAmountDown } from 'react-icons/fa';
import { getTopics } from '../../api/base.api';


export function SelectOption({ onCategoryChange, onRankingTypeChange, onSearchChange }) {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('0');
  const [rankingType, setRankingType] = useState('0');
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const response = await getTopics();
      setCategories(response.data.results);
    } catch (error) {
      setError(error);
    }
  }

  function handleCategoryChange(e) {
    const value = e.target.value;
    setSelectedCategory(value);
    onCategoryChange(value);
  }

  function handleRankingTypeChange(e) {
    const value = e.target.value;
    setRankingType(value);
    onRankingTypeChange(value);
  }

  function handleSearchChange(e) {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange?.(value);
  }

  const sortLabel = rankingType === '0' ? 'Sort(MXP)' : 'Sort(AVG)';

  const topicLabel = selectedCategory === '0'
    ? 'Filter by topics'
    : categories.find(c => String(c.id) === selectedCategory)?.title || 'Filter by topics';

  return (
    <div className="flex flex-wrap items-center gap-3 mb-4">
      {error && <div className="text-red-500 text-sm">Error loading topics</div>}

      <div className="relative">
        <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-2 sm:px-4 py-2 border border-gray-200 pointer-events-none select-none transition-colors">
          <FaSortAmountDown className="text-gray-600 text-sm flex-shrink-0" />
          <span className="hidden sm:block text-sm font-medium text-gray-700">{sortLabel}</span>
          <FaChevronDown className="hidden sm:block text-gray-500 text-xs flex-shrink-0" />
        </div>
        <select
          value={rankingType}
          onChange={handleRankingTypeChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full"
        >
          <option value="0">By Points (MXP)</option>
          <option value="1">By Average (AVG)</option>
        </select>
      </div>

      <div className="relative">
        <div className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 rounded-full px-2 sm:px-4 py-2 border border-gray-200 pointer-events-none select-none transition-colors">
          <FaFilter className="text-gray-600 text-sm flex-shrink-0" />
          <span className="hidden sm:block text-sm font-medium text-gray-700">{topicLabel}</span>
          <FaChevronDown className="hidden sm:block text-gray-500 text-xs flex-shrink-0" />
        </div>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full"
        >
          <option value="0">All topics</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[200px] relative">
        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none" />
        <input
          type="text"
          value={searchValue}
          onChange={handleSearchChange}
          placeholder="Search by Name"
          className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#3DB1FF] focus:border-transparent"
        />
      </div>
    </div>
  );
}
