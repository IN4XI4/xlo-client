import React, { useState, useEffect, useMemo } from 'react';
import { FaSearch, FaFire, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SortIcon from '../../assets/assessments/Sort.svg';
import SearchIcon from '../../assets/assessments/Search.svg';
import OrderIcon from '../../assets/assessments/Order.svg';
import FilterIcon from '../../assets/assessments/Filter.svg';
import TopicIcon from '../../assets/assessments/Topic.svg';
import LanguageIcon from '../../assets/assessments/Language.svg';
import { getTopicTags, getTopicsByCategory } from '../../api/base.api';
import { ASSESSMENT_LANGUAGES } from '../../globals';


const ORDER_OPTIONS = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'most_difficult', label: 'Most Difficult' },
  { value: 'least_difficult', label: 'Least Difficult' },
];

export function FilterPanel({ onNameFilterChange, onToggleTopic, onToggleLanguage, onToggleOrderBy, filters }) {
  const [categories, setCategories] = useState([]);
  const [topics, setTopics] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  const [inputValue, setInputValue] = useState('');
  const [orderOpen, setOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState('popularity');
  const [languageOpen, setLanguageOpen] = useState(false);
  const [topicOpen, setTopicOpen] = useState(false);
  const navigate = useNavigate();

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
    setSelectedOrder(value);
    onToggleOrderBy(orderByMapping[value]);
    setOrderOpen(false);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    onNameFilterChange(inputValue);
  };

  return (
    <div className="p-4 text-gray-700">
      <div className='text-xl border-b pb-1 flex items-center gap-2'>
        <img src={SortIcon} className="w-5 h-5" alt="" />
        Sort
      </div>
      <div className="pb-2 mt-2">
        <div
          className="flex items-center bg-gray-200 rounded-full px-3 h-10 cursor-pointer select-none"
          onClick={() => setOrderOpen(o => !o)}
        >
          <img src={OrderIcon} className="w-4 h-4 flex-shrink-0" alt="" />
          <div className="flex-1 px-2 text-gray-700 text-sm truncate">
            {ORDER_OPTIONS.find(o => o.value === selectedOrder)?.label}
          </div>
          <FaChevronDown className={`flex-shrink-0 text-gray-500 text-xs transition-transform ${orderOpen ? 'rotate-180' : ''}`} />
        </div>
        <div className={`mt-1 rounded-xl overflow-hidden transition-all duration-200 ${orderOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
          {ORDER_OPTIONS.map(opt => (
            <div
              key={opt.value}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-50"
              onClick={() => handleOrderByChange(opt.value)}
            >
              <input
                type="radio"
                readOnly
                checked={selectedOrder === opt.value}
                className="accent-[#3DB1FF]"
              />
              <div className="text-sm text-gray-700">{opt.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div className='text-xl border-b pb-1 mb-3 flex items-center gap-2'>
        <img src={SearchIcon} className="w-5 h-5" alt="" />
        Search
      </div>
      <form onSubmit={handleSearch}>
        <div className="flex items-center border border-[#3DB1FF] rounded-full px-3 h-10 bg-white mb-3">
          <button type="submit" className="flex items-center justify-center flex-shrink-0 text-[#3DB1FF]">
            <FaSearch />
          </button>
          <input
            type="text"
            id="search-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by name"
            className="flex-1 outline-none focus:outline-none focus:ring-0 px-2 bg-transparent border-0"
          />
        </div>
        <div className='text-xl border-b pb-1 flex items-center gap-2 mb-3'>
          <img src={FilterIcon} className="w-5 h-5" alt="" />
          Filter
        </div>
        <div
          className="flex items-center bg-gray-200 rounded-full px-3 h-10 cursor-pointer select-none mb-2"
          onClick={() => setLanguageOpen(o => !o)}
        >
          <img src={LanguageIcon} className="w-4 h-4 flex-shrink-0" alt="" />
          <div className="flex-1 px-2 text-gray-700 text-sm">Language</div>
          <FaChevronDown className={`flex-shrink-0 text-gray-500 text-xs transition-transform ${languageOpen ? 'rotate-180' : ''}`} />
        </div>
        <div className={`overflow-hidden transition-all duration-200 ${languageOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
          {ASSESSMENT_LANGUAGES.map((lang) => (
            <div
              key={lang.code}
              className="flex items-center mb-1 px-2 cursor-pointer select-none"
              onClick={() => onToggleLanguage(lang.code, lang.label)}
            >
              <input type="checkbox" checked={lang.code in filters.languages} readOnly className="rounded cursor-pointer" />
              <label className="ml-2 text-gray-500 cursor-pointer">{lang.label}</label>
            </div>
          ))}
        </div>
        <div
          className="flex items-center bg-gray-200 rounded-full px-3 h-10 cursor-pointer select-none mt-2 mb-2"
          onClick={() => setTopicOpen(o => !o)}
        >
          <img src={TopicIcon} className="w-4 h-4 flex-shrink-0" alt="" />
          <div className="flex-1 px-2 text-gray-700 text-sm">Topic</div>
          <FaChevronDown className={`flex-shrink-0 text-gray-500 text-xs transition-transform ${topicOpen ? 'rotate-180' : ''}`} />
        </div>
        <div className={`pb-2 overflow-hidden transition-all duration-200 ${topicOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {categories.map(category => (
            <div key={category.id}>
              <div className="flex justify-between items-center mb-2 cursor-pointer px-2" onClick={() => toggleCategoryExpansion(category.id)}>
                <div className="flex-grow text-gray-500 text-sm">{category.name}</div>
                <div className="p-1 text-gray-500">
                  {expandedCategories[category.id] ? <FaChevronDown /> : <FaChevronRight />}
                </div>
              </div>
              {expandedCategories[category.id] && topics[category.id] && (
                <div className="ml-4">
                  {topics[category.id].map(topic => (
                    <div key={topic.id} className="flex items-center mb-1">
                      <div
                        className="flex w-full items-center cursor-pointer"
                        onClick={() => onToggleTopic(topic.id, topic.title)}
                      >
                        <input className="rounded cursor-pointer" type="checkbox" checked={topic.id in filters.topics} readOnly />
                        <label className="ml-2 text-gray-500 text-sm cursor-pointer">{topic.title}</label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </form>
      <div className='border-t pt-3 flex items-center justify-center'>
        <div
          onClick={() => navigate('/rankings/')}
          className="inline-flex items-center gap-3 bg-[#3DB1FF] rounded-full px-4 py-2 cursor-pointer"
        >
          <div className="bg-white rounded-full p-1 flex items-center justify-center flex-shrink-0">
            <FaFire className="text-[#3DB1FF] text-lg" />
          </div>
          <div className="text-white font-bold tracking-wide text-sm">RANKING PAGE</div>
        </div>
      </div>
    </div>
  );
}
