import React, { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { Select } from 'flowbite-react';
import { getTopicTags, getTopicsByCategory } from '../../api/base.api';
import { ASSESSMENT_LANGUAGES } from '../../globals';


export function AssessmentsFilterCol({ onNameFilterChange, onToggleTopic, onToggleLanguage, onToggleOrderBy, filters }) {
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const res = await getTopicTags();
      setCategories(res.data.results);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  async function toggleCategoryExpansion(categoryId) {
    setExpandedCategories(prev => {
      const isExpanded = !prev[categoryId];
      if (isExpanded && !topics[categoryId]) {
        loadTopics(categoryId);
      }
      return { ...prev, [categoryId]: isExpanded };
    });
  }

  async function loadTopics(categoryId) {
    try {
      const res = await getTopicsByCategory(categoryId);
      setTopics(prev => ({ ...prev, [categoryId]: res.data.results }));
    } catch (error) {
      console.error('Error fetching topics:', error);
    }
  }

  const orderByMapping = useMemo(
    () => ({
      popularity: "-attempts_count",
      newest: "-created_at",
      oldest: "created_at",
      most_difficult: "-difficulty",
      least_difficult: "difficulty",
    }),
    []
  );

  const handleOrderByChange = (value) => {
    onToggleOrderBy(orderByMapping[value]);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    onNameFilterChange(inputValue);
  };

  return (
    <div className="hidden md:block md:col-span-3 border-r border-gray-300 p-4">
      <div className='text-3xl border-b pb-1 text-gray-500'>
        Order by
      </div>
      <div className="pb-3">
        <Select
          className="w-full p-2 rounded mt-2"
          onChange={(e) => handleOrderByChange(e.target.value)}
          id="order_by"
        >
          <option value="popularity">Popularity</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="most_difficult">Most Difficult</option>
          <option value="least_difficult">Least Difficult</option>
        </Select>
      </div>
      <div className='text-3xl border-b pb-1 text-gray-500'>
        Filter
      </div>
      <form onSubmit={handleSearch}>
        <label htmlFor="search-input" className="block mb-2 py-2 text-2xl text-gray-500">By name</label>
        <div className="flex items-center">
          <input
            type="text"
            id="search-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by name"
            className="w-full p-2 border border-gray-300 rounded me-2"
          />
          <button type="submit" className="bg-gray-200 text-gray-700 rounded-r p-3">
            <FaSearch />
          </button>
        </div>
        <div className='py-4 text-2xl text-gray-500'>By language</div>
        {ASSESSMENT_LANGUAGES.map((lang) => (
          <div
            key={lang.code}
            className="flex items-center mb-1 cursor-pointer select-none"
            onClick={() => onToggleLanguage(lang.code, lang.label)}
          >
            <input type="checkbox" checked={lang.code in filters.languages} readOnly className="rounded" />
            <label className="ml-2 text-gray-500">{lang.label}</label>
          </div>
        ))}
        <label htmlFor="category-input" className="block mb-2 py-2 text-2xl text-gray-500">By category</label>
        {categories.map(category => (
          <div key={category.id} className="category-container">
            <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => toggleCategoryExpansion(category.id)}>
              <div className="flex-grow text-gray-500">
                {category.name}
              </div>
              <div className="p-2 text-gray-500">
                {expandedCategories[category.id] ? <FaChevronDown /> : <FaChevronRight />}
              </div>
            </div>
            {expandedCategories[category.id] && topics[category.id] && (
              <div className="ml-4">
                {topics[category.id].map(topic => (
                  <div key={topic.id} className="flex items-center mb-1">
                    <div
                      className="flex w-full"
                      onClick={() => onToggleTopic(topic.id, topic.name)}
                    >
                      <input
                        type="checkbox"
                        checked={topic.id in filters.topics}
                        readOnly
                      />
                      <label className="ml-2">{topic.name}</label>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </form>
    </div>
  );
}