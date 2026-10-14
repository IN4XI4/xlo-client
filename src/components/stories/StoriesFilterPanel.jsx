import { useEffect, useState } from 'react';
import { FaSearch, FaChevronDown, FaGlobe, FaPlus, FaMinus, FaClipboardCheck } from 'react-icons/fa';
import { IoIosSpeedometer } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import SortIcon from '../../assets/assessments/Sort.svg';
import SearchIcon from '../../assets/assessments/Search.svg';
import OrderIcon from '../../assets/assessments/Order.svg';
import FilterIcon from '../../assets/assessments/Filter.svg';
import TopicIcon from '../../assets/assessments/Topic.svg';
import LanguageIcon from '../../assets/assessments/Language.svg';
import { ASSESSMENT_LANGUAGES, STORY_DIFFICULTY_LEVELS, flagMap } from '../../globals';

const ORDER_OPTIONS = [
  { value: '-created_time', label: 'Newest' },
  { value: 'created_time', label: 'Oldest' },
  { value: '-views_count', label: 'Most viewed' },
  { value: 'views_count', label: 'Least viewed' },
];

export function StoriesFilterPanel({ onNameFilterChange, onToggleTopic, onToggleLanguage, onToggleDifficulty, onToggleOrderBy, filters, categories }) {
  const [expandedCategories, setExpandedCategories] = useState({});
  const [inputValue, setInputValue] = useState(filters.name);
  const [orderOpen, setOrderOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [difficultyOpen, setDifficultyOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setInputValue(filters.name);
  }, [filters.name]);

  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const handleOrderByChange = (value) => {
    onToggleOrderBy(value);
    setOrderOpen(false);
  };

  const handleSearch = (event) => {
    event.preventDefault();
    onNameFilterChange(inputValue);
  };

  const goToAssessments = () => {
    const params = new URLSearchParams();
    filters.topics.forEach(topicId => params.append('topic', topicId));
    const query = params.toString();
    navigate(query ? `/assessments?${query}` : '/assessments');
    window.scrollTo(0, 0);
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
            {ORDER_OPTIONS.find(o => o.value === filters.ordering)?.label ?? ORDER_OPTIONS[0].label}
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
                checked={filters.ordering === opt.value}
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
            autoComplete="off"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Search by name"
            className="flex-1 outline-none focus:outline-none focus:ring-0 px-2 bg-transparent border-0 autofill:shadow-[inset_0_0_0_1000px_white] autofill:[-webkit-text-fill-color:#374151]"
          />
        </div>
      </form>
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
            onClick={() => onToggleLanguage(lang.code)}
          >
            <input type="checkbox" checked={filters.languages.includes(lang.code)} readOnly className="rounded cursor-pointer" />
            {flagMap[lang.code]
              ? <img src={flagMap[lang.code]} className="ml-2 w-4 h-4 rounded-full object-cover flex-shrink-0" alt="" />
              : <FaGlobe className="ml-2 text-gray-400 flex-shrink-0" />
            }
            <label className="ml-1 text-gray-500 cursor-pointer">{lang.label}</label>
          </div>
        ))}
      </div>
      <div
        className="flex items-center bg-gray-200 rounded-full px-3 h-10 cursor-pointer select-none mb-2"
        onClick={() => setDifficultyOpen(o => !o)}
      >
        <IoIosSpeedometer className="w-4 h-4 flex-shrink-0 text-gray-700" />
        <div className="flex-1 px-2 text-gray-700 text-sm">Difficulty</div>
        <FaChevronDown className={`flex-shrink-0 text-gray-500 text-xs transition-transform ${difficultyOpen ? 'rotate-180' : ''}`} />
      </div>
      <div className={`overflow-hidden transition-all duration-200 ${difficultyOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
        {STORY_DIFFICULTY_LEVELS.map((level) => (
          <div
            key={level.value}
            className="flex items-center mb-1 px-2 cursor-pointer select-none"
            onClick={() => onToggleDifficulty(level.value)}
          >
            <input type="checkbox" checked={filters.difficulties.includes(String(level.value))} readOnly className="rounded cursor-pointer" />
            <label className="ml-2 text-gray-500 cursor-pointer">{level.label}</label>
          </div>
        ))}
      </div>
      <div className='text-xl border-b pb-1 mt-2 mb-3 flex items-center gap-2'>
        <img src={TopicIcon} className="w-5 h-5" alt="" />
        Category & Topic
      </div>
      <div className="flex flex-col gap-2 pb-3">
        {categories.map(category => (
          <div key={category.id} style={{ "--tag-color": category.color || "#3DB1FF" }}>
            <div
              className="flex items-center bg-[var(--tag-color)] text-white rounded-full px-4 h-8 cursor-pointer select-none"
              onClick={() => toggleCategoryExpansion(category.id)}
            >
              <div className="flex-1 text-sm truncate">{category.name}</div>
              {expandedCategories[category.id]
                ? <FaMinus className="flex-shrink-0 text-xs" />
                : <FaPlus className="flex-shrink-0 text-xs" />}
            </div>
            {expandedCategories[category.id] && (
              <div className="ml-4 mt-2">
                {category.topics.map(topic => (
                  <div
                    key={topic.id}
                    className="flex items-center mb-1 cursor-pointer select-none"
                    onClick={() => onToggleTopic(topic.id)}
                  >
                    <input type="checkbox" checked={filters.topics.includes(String(topic.id))} readOnly className="rounded cursor-pointer" />
                    <label className="ml-2 text-gray-500 text-sm cursor-pointer">{topic.title}</label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className='border-t pt-3 flex items-center justify-center'>
        <div
          onClick={goToAssessments}
          className="inline-flex items-center gap-3 bg-[#3DB1FF] rounded-full px-4 py-1 cursor-pointer"
        >
          <div className="bg-white rounded-full p-1 flex items-center justify-center flex-shrink-0">
            <FaClipboardCheck className="text-[#3DB1FF] text-lg" />
          </div>
          <div className="text-white tracking-wide text-sm">GO TO ASSESSMENTS</div>
        </div>
      </div>
    </div>
  );
}
