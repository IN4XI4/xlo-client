import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTopic } from '../api/base.api';
import { FaArrowLeft, FaPlus, FaRegBell, FaSearch } from 'react-icons/fa';
import { TextInput, Tooltip } from 'flowbite-react';
import { StoriesList } from '../components/topics/StoriesList';


export function TopicStoriesPage() {
  const { id } = useParams();
  const [topic, setTopic] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    loadTopic();
  }, [id]);

  async function loadTopic() {
    try {
      setIsLoading(true);
      const res = await getTopic(id);
      setTopic(res.data);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  }
  return (
    <div className="pt-20 md:pt-28 px-4 md:px-16 lg:px-32 xl:px-44">
      <div className='text-3xl md:text-4xl font-extrabold'>
        {topic.title}
      </div>
      <div className='text-xl py-3'>"Text block"...</div>
      <div className='flex items-stretch py-4 border-b-4 border-[#D9D9D9]'>
        <div className='flex-none pe-3 md:pe-6'>
          <Link to="/">
            <button className="p-3 md:p-4 bg-gray-200 rounded-lg border">
              <FaArrowLeft className='text-[#6B7280]' />
            </button>
          </Link>
        </div>
        <div className='grow pe-3 md:pe-6 self-center'>
          <TextInput id="search_story" type="text" icon={FaSearch} placeholder="Quick search for a story" color="white" />
        </div>
        <div className='flex-none pe-3 md:pe-6'>
          <Tooltip content="Notification bell" style="light">
            <button className="p-3 md:p-4 bg-gray-200 rounded-lg border">
              <FaRegBell className='text-[#6B7280]' />
            </button>
          </Tooltip>
        </div>
        <div className='flex items-stretch'>
          <button className="hidden md:flex items-center p-3 rounded-md bg-gray-200 text-[#6B7280]">
            <FaPlus className="mr-2" /> New Story
          </button>
          <button className="md:hidden flex items-center p-3 rounded-md bg-gray-200 text-[#6B7280]">
            <FaPlus className="md:mr-2" />
          </button>
        </div>
      </div>
      <div className='py-4'>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <StoriesList topicId={id} categoryId={topic.tag} />
        )}
      </div>
    </div>
  )
}
