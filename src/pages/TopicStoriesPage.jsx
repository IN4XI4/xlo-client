import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { getTopicBySlug } from '../api/base.api';
import { FaArrowLeft, FaHeart, FaPlus, FaRegHeart, FaSearch } from 'react-icons/fa';
import { Alert, TextInput } from 'flowbite-react';
import { StoriesList } from '../components/topics/StoriesList';
import { ComingSoonModal } from '../components/modals/ComingSoonModal';
import { deleteLike, likeSomething } from '../api/blog.api';
import { HiInformationCircle } from 'react-icons/hi';


export function TopicStoriesPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [topic, setTopic] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContext, setModalContext] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setShowAlert(!token);
  }, []);

  useEffect(() => {
    if (location.state?.storyCreated) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        navigate(location.pathname, { replace: true, state: {} });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  useEffect(() => {
    loadTopic();
  }, [slug]);

  async function loadTopic() {
    try {
      setIsLoading(true);
      const res = await getTopicBySlug(slug);
      setTopic(res.data);
      setIsLoading(false);
    } catch (error) {
      setError(error);
      setIsLoading(false);
    }
  }

  const handleLikeTopic = async () => {
    const data = {
      liked: true,
      content_type: topic.topic_content_type_id,
      object_id: topic.id,
      is_active: true
    };

    try {
      const response = await likeSomething(data);
      setTopic(prevTopic => ({ ...prevTopic, user_has_liked: response.data.id }));
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  const handleUnlikeTopic = async () => {
    if (topic.user_has_liked) {
      try {
        await deleteLike(topic.user_has_liked);
        setTopic(prevTopic => ({ ...prevTopic, user_has_liked: null }));
      } catch (error) {
        console.error("Error al quitar el like:", error);
      }
    }
  };
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

  const createStoryHandler = () => {
    if (topic.is_creator) {
      navigate(`/create-story/${topic.id}/${topic.slug}`);
    }
  };
  return (
    <div className="pt-24 md:pt-28 px-4 md:px-12 lg:px-24 xl:px-28 3xl:px-32">
      {showAlert && (
        <Alert
          color="info"
          icon={HiInformationCircle}
          className="mb-4"
          onDismiss={() => setShowAlert(false)}
        >
          <span className="font-medium">Sign in to unlock all features and enhance your experience!</span>
        </Alert>
      )}
      {showSuccessMessage && (
        <Alert color="success" icon={HiInformationCircle} className='mb-4'>
          <span className="font-medium">Story created successfully!</span>
        </Alert>
      )}
      <div className='text-2xl md:text-4xl font-extrabold'>
        {topic.title}
      </div>
      {topic.description && topic.description !== "" && (
        <div className='text-sm md:text-lg text-gray-500'>
          {topic.description}
        </div>
      )}
      <div className='flex items-center py-4 border-b-4 border-[#D9D9D9]'>
        <div className='flex-none pe-2 md:pe-6'>
          <Link to="/">
            <button className="p-2 md:p-4 bg-gray-200 rounded-full border">
              <FaArrowLeft className='text-[#6B7280]' />
            </button>
          </Link>
        </div>
        <div className='grow pe-2 md:pe-6 self-center'>
          <TextInput id="search_story"
            type="text"
            icon={FaSearch}
            placeholder="Quick search for a story"
            color="white"
            value={inputText}
            onChange={handleTextInputChange}
            onKeyDown={handleKeyPress} />
        </div>

        {isAuthenticated && (
          <div className='flex-none pe-2 md:pe-6'>
            <button className="p-2 md:p-4 bg-gray-200 rounded-full border"
              onClick={topic.user_has_liked ? handleUnlikeTopic : handleLikeTopic}>
              {topic.user_has_liked ? <FaHeart className='text-[#3DB1FF]' /> : <FaRegHeart className='text-[#3DB1FF]' />}
            </button>
          </div>)}

        <div className='flex-none items-stretch'>
          <button className="hidden md:flex items-center p-3 rounded-full bg-gray-200 text-[#6B7280]"
            onClick={createStoryHandler}>
            <FaPlus className="mr-2" /> Create a story
          </button>
          <button className="md:hidden p-2 rounded-full bg-gray-200 text-[#6B7280] border"
            onClick={createStoryHandler}>
            <FaPlus className='text-[#3DB1FF]' />
          </button>
        </div>
      </div>
      <div className='py-4'>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <StoriesList topicId={topic.id} categoryId={topic.tag} searchText={searchText} />
        )}
      </div>
      {isModalOpen && <ComingSoonModal title={modalTitle} context={modalContext} onClose={() => setIsModalOpen(false)} />}
    </div>
  )
}