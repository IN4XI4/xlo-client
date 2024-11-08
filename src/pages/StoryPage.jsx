import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Alert, Progress } from 'flowbite-react';
import { FaSync } from 'react-icons/fa';
import { HiInformationCircle } from 'react-icons/hi2';

import { useAppState } from '../context/ScrollContext';
import { BlocksList } from '../components/topics/BlocksList';
import { InteractBox } from '../components/topics/InteractBox';
import { CommentsList } from '../components/topics/comments/CommentsList';
import { RateStory } from '../components/topics/RateStory';
import { StoryNavBar } from '../components/topics/StoryNavBar';

import { getContentTypes } from '../api/base.api';
import { getCardsByStory, getStoryBySlug, userViewStory } from '../api/blog.api';

export function StoryPage() {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const commentsRef = useRef(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [story, setStory] = useState([]);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isCardsLoaded, setIsCardsLoaded] = useState(false);
  const progressPercentage = cards.length > 0 ? (currentCardIndex + 1) / cards.length * 100 : 0;
  const [storyContentTypeId, setStoryContentTypeId] = useState(null);
  const [blockContentTypeId, setBlockContentTypeId] = useState(null);
  const [commentContentTypeId, setCommentContentTypeId] = useState(null);
  const { setIsScrolled, updateTitles } = useAppState();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    if (location.state?.storyUpdated) {
      setShowSuccessMessage(true);
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        navigate(location.pathname, { replace: true, state: {} });
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  const goToNextCard = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      window.scrollTo(0, 0);
    }
  };

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const goToFirstCard = () => {
    setCurrentCardIndex(0);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    loadStory();
  }, [slug]);

  async function loadStory() {
    try {
      const res = await getStoryBySlug(slug);
      const token = localStorage.getItem('token');
      setStory(res.data);
      if (!res.data.user_has_viewed && token) {
        await userViewStory({ story: res.data.id });
      }
      const cardsResponse = await getCardsByStory(res.data.id);
      setCards(cardsResponse.data.results);
      setIsCardsLoaded(true);
      setCurrentCardIndex(0);
      window.scrollTo(0, 0);
    } catch (error) {
      setError(error);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadContentTypes();
    }
  }, []);

  useEffect(() => {
    if (isCardsLoaded && location.state?.scrollToComments && commentsRef.current) {
      setTimeout(() => {
        window.scrollTo({
          top: commentsRef.current.offsetTop + 280,
          behavior: 'smooth'
        });
      }, 200);
    }
  }, [isCardsLoaded, location.state]);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setIsScrolled(position > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [setIsScrolled]);

  useEffect(() => {
    if (story) {
      if (cards.length > 0) {
        updateTitles(story.title, cards[currentCardIndex].title);
      } else {
        updateTitles(story.title, '');
      }
    }
  }, [story, cards, currentCardIndex, updateTitles]);

  async function loadContentTypes() {
    try {
      const res = await getContentTypes();
      const contentTypes = res.data;
      const storyType = contentTypes.find(ct => ct.model === 'story');
      const blockType = contentTypes.find(ct => ct.model === 'block');
      const commentType = contentTypes.find(ct => ct.model === 'comment');
      if (storyType) setStoryContentTypeId(storyType.id);
      if (blockType) setBlockContentTypeId(blockType.id);
      if (commentType) setCommentContentTypeId(commentType.id);
    } catch (error) {
      console.error('Error al cargar los ContentTypes', error);
    }
  }

  const updateCardRecallStatus = (updatedRecallId, updatedRecallLevel, userHasRecalled) => {
    const updatedCards = cards.map((card, index) => {
      if (index === currentCardIndex) {
        return {
          ...card,
          user_has_recalled: {
            ...card.user_has_recalled,
            recall_id: updatedRecallId,
            level: updatedRecallLevel,
            recall: userHasRecalled,
          },
        };
      }
      return card;
    });
    setCards(updatedCards);
  };

  if (error) {
    return <div className="text-center p-10 text-xl text-gray-700">
      Story not found or you do not have permission to view it.
    </div>;
  }

  return (
    <div className="pt-24 md:pt-28 px-4 md:px-16 lg:px-32 xl:px-44">
      {showSuccessMessage && (
        <Alert color="success" icon={HiInformationCircle} className='mb-4'>
          <span className="font-medium">Story updated successfully!</span>
        </Alert>
      )}
      <div className='text-sm text-gray-500 flex items-center'>
        <span className='font-semibold'>Author: </span>
        <span className='ps-2'>{story.owner_name}</span>
        {story.is_owner &&
          <div className='ps-2'>
            <Link to={`/edit-story/${story.id}`}
              className='text-gray-500 border-gray-100 border rounded-lg bg-white py-1 px-2'>
              Edit Story
            </Link>
          </div>}
      </div>
      <div className='py-2 flex items-center'>
        {story.image && (
          <div className="hidden md:flex items-center justify-center md:w-20 md:h-16 md:mr-3">
            <img src={story.image} alt={story.title} className="object-cover w-full h-full rounded-lg" />
          </div>
        )}
        <div className='text-4xl font-extrabold md:pb-2'>
          {story.title}
        </div>
      </div>

      {cards.length > 0 && currentCardIndex < cards.length && (
        <>
          <div className='text-xl text-gray-500 pb-3'>
            {cards[currentCardIndex].title}
          </div>
          <div className='md:px-16 lg:px-24 mb-3'>
            <BlocksList card={cards[currentCardIndex]} blockContentTypeId={blockContentTypeId} />
          </div>
          <div className='md:px-16 lg:px-24 mb-4'>
            <div className='text-end text-sm text-gray-500'>
              {progressPercentage.toFixed(0)}%
            </div>
            <div className='flex items-center'>
              <div className='flex-none text-gray-500 mr-4 hover:cursor-pointer' onClick={goToFirstCard}>
                <FaSync />
              </div>
              <div className='flex-1'>
                <Progress progress={progressPercentage.toFixed(0)} />
              </div>
            </div>
          </div>
          {isAuthenticated && (
            <>
              <InteractBox story={story} setStory={setStory} storyContentTypeId={storyContentTypeId} />
              <RateStory />
            </>
          )}
        </>
      )}
      {isCardsLoaded && (
        <div ref={commentsRef} className='py-4'>
          <CommentsList storyId={story.id} commentContentTypeId={commentContentTypeId} />
        </div>
      )}
      {isCardsLoaded && (
        <StoryNavBar
          topicSlug={story.topic_slug}
          goToPreviousCard={goToPreviousCard}
          goToNextCard={goToNextCard}
          previousStorySlug={story.previous_story_slug}
          nextStorySlug={story.next_story_slug}
          user_has_recalled={cards[currentCardIndex].user_has_recalled.recall}
          recall_level={cards[currentCardIndex].user_has_recalled.level}
          recall_id={cards[currentCardIndex].user_has_recalled.recall_id}
          card_id={cards[currentCardIndex].id}
          onUpdateRecall={updateCardRecallStatus}
          isAuthenticated={isAuthenticated}
        />
      )}
    </div>
  )
}
