import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getTopic } from '../api/base.api';
import { FaArrowLeft, FaPlus, FaRegBell, FaSearch } from 'react-icons/fa';
import { TextInput, Tooltip } from 'flowbite-react';
import { StoriesList } from '../components/topics/StoriesList';
import { ComingSoonModal } from '../components/ComingSoonModal';


export function TopicStoriesPage() {
  const { id } = useParams();
  const [topic, setTopic] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContext, setModalContext] = useState('');

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

  const handleTextInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      setSearchText(inputText);
    }
  };

  const openModal = (title, context) => {
    setModalTitle(title);
    setModalContext(context);
    setIsModalOpen(true);
  };

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
          <TextInput id="search_story"
            type="text"
            icon={FaSearch}
            placeholder="Quick search for a story"
            color="white"
            value={inputText}
            onChange={handleTextInputChange}
            onKeyDown={handleKeyPress} />
        </div>
        <div className='flex-none pe-3 md:pe-6'>
          <Tooltip content="Notification bell" style="light">
            <button className="p-3 md:p-4 bg-gray-200 rounded-lg border"
              onClick={() => openModal('Mes Nouvelles histories', 'Le mode qui vous permet de consulter toutes nouvelles histoires provenant des sujets marqués à l’aide de la cloche de notification sera disponible prochainement.')}>
              <FaRegBell className='text-[#6B7280]' />
            </button>
          </Tooltip>
        </div>
        <div className='flex items-stretch'>
          <button className="hidden md:flex items-center p-3 rounded-md bg-gray-200 text-[#6B7280]"
            onClick={() => openModal('Créer une histoire',
              'Plusieurs manières de supporter la plateforme seront bientôt disponibles. Vous pouvez toujours nous contacter sur contact@mixelo.io si vous souhaitez nous aider de quelconque façon.')}>
            <FaPlus className="mr-2" /> Créer une histoire
          </button>
          <button className="md:hidden flex items-center p-3 rounded-md bg-gray-200 text-[#6B7280]"
            onClick={() => openModal('Créer une histoire', 'Plusieurs manières de supporter la plateforme seront bientôt disponibles. Vous pouvez toujours nous contacter sur contact@mixelo.io si vous souhaitez nous aider de quelconque façon.')}>
            <FaPlus className="md:mr-2" />
          </button>
        </div>
      </div>
      <div className='py-4'>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <StoriesList topicId={id} categoryId={topic.tag} searchText={searchText} />
        )}
      </div>
      {isModalOpen && <ComingSoonModal title={modalTitle} context={modalContext} onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}
