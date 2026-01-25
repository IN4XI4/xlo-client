import React, { useEffect, useState } from 'react'
import { getTopics } from '../../api/base.api';


export function SelectOption({ onCategoryChange, onRankingTypeChange }) {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('0');
  const [rankingType, setRankingType] = useState('0');

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

  function handleRankingTypeChange(type) {
    setRankingType(type);
    onRankingTypeChange(type);
  }

  return (
    <div>
      {error && <div>Error loading categories: {error.message}</div>}
      <div>
        <label className="block text-sm font-medium mb-1">
          Topic
        </label>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option value="0">Global</option>

          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.title}
            </option>
          ))}
        </select>
      </div>
      <div className="flex mt-4">
        <button
          className={`py-2 px-4 border rounded ${rankingType === '0' ? 'bg-green-500 text-white' : 'bg-white'}`}
          onClick={() => handleRankingTypeChange('0')}
        >
          By Points
        </button>
        <button
          className={`py-2 px-4 border rounded ml-2 ${rankingType === '1' ? 'bg-green-500 text-white' : 'bg-white'}`}
          onClick={() => handleRankingTypeChange('1')}
        >
          By Average
        </button>
      </div>
    </div>
  )
}
