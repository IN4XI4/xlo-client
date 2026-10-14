import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { Select } from 'flowbite-react'

import { getTopicTags } from '../../api/base.api';
import { LabelWithInfo } from './StoryOptions';
import { INFO_OPTIONS } from './StoryOptionsInfo';


// Required category + topic picker. Only `topic` is a form field; the category
// is local state that narrows the topic list.
export function StoryTopicSelector({ control, errors, setValue }) {
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  async function loadCategories() {
    try {
      const res = await getTopicTags();
      setCategories(res.data.results);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  }

  const topics = categories.find(c => c.id === categoryId)?.topics ?? [];

  const handleCategoryChange = (e) => {
    setCategoryId(e.target.value === '' ? '' : Number(e.target.value));
    setValue('topic', '');
  };

  return (
    <div className='bg-[#E3F4FF] rounded-lg p-3 mb-3 grid grid-cols-1 md:grid-cols-2 gap-3'>
      <div>
        <LabelWithInfo label="Category" required infoContent={INFO_OPTIONS.category} />
        <Select value={categoryId} onChange={handleCategoryChange}>
          <option value="" disabled>Select Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </Select>
      </div>
      <div>
        <LabelWithInfo label="Topic" required infoContent={INFO_OPTIONS.topic} />
        <Controller
          control={control}
          name="topic"
          rules={{ required: 'Topic is required' }}
          render={({ field }) => (
            <Select {...field}
              value={field.value ?? ''}
              disabled={categoryId === ''}
              onChange={(e) => field.onChange(e.target.value === '' ? '' : Number(e.target.value))}>
              <option value="" disabled>{categoryId === '' ? 'Select a category first' : 'Select Topic'}</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>{topic.title}</option>
              ))}
            </Select>
          )}
        />
        {errors.topic && <div className="text-red-500">A topic is required.</div>}
      </div>
    </div>
  )
}
