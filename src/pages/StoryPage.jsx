import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom';
import { deleteLike, getCardsByStory, getStoryBySlug, likeSomething, updateLike, userViewStory } from '../api/blog.api';
import { BlocksList } from '../components/topics/BlocksList';
import { FaAngleDoubleLeft, FaAngleDoubleRight, FaAngleLeft, FaAngleRight, FaArrowLeft, FaSync, FaThumbsDown, FaThumbsUp } from 'react-icons/fa';
import { Progress } from 'flowbite-react';
import { InteractBox } from '../components/topics/InteractBox';
import { CommentsList } from '../components/topics/comments/CommentsList';
import { getContentTypes } from '../api/base.api';
import { useAppState } from '../context/ScrollContext';
import { RateStory } from '../components/topics/RateStory';


export function StoryPage() {
  const { slug } = useParams();
  const location = useLocation();
  const commentsRef = useRef(null);
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

  const goToLastCard = () => {
    setCurrentCardIndex(cards.length - 1);
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
      console.log(commentsRef.current.offsetTop);
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

  const handleLikeOrDislike = async (isLike) => {
    if (!isAuthenticated) {
      return
    }
    const alreadyLiked = story.user_has_liked.liked;
    const alreadyDisliked = story.user_has_liked.disliked;

    if ((isLike && alreadyLiked) || (!isLike && alreadyDisliked)) {
      try {
        await deleteLike(story.user_has_liked.like_id);
        setStory({
          ...story,
          user_has_liked: { ...story.user_has_liked, liked: false, disliked: false, like_id: null }
        });
      } catch (error) {
        console.error('Error removing like/dislike', error);
      }
    } else if ((isLike && alreadyDisliked) || (!isLike && alreadyLiked)) {
      const data = { liked: isLike };
      try {
        await updateLike(story.user_has_liked.like_id, data);
        setStory({
          ...story,
          user_has_liked: { ...story.user_has_liked, liked: isLike, disliked: !isLike }
        });
      } catch (error) {
        console.error('Error updating like/dislike', error);
      }
    } else {
      const data = {
        liked: isLike,
        content_type: storyContentTypeId,
        object_id: story.id,
        is_active: true
      };
      try {
        const response = await likeSomething(data);
        setStory({
          ...story,
          user_has_liked: { ...story.user_has_liked, liked: isLike, disliked: !isLike, like_id: response.data.id }
        });
      } catch (error) {
        console.error('Error adding like/dislike', error);
      }
    }
  };

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
    <div className="pt-20 md:pt-28 px-4 md:px-16 lg:px-32 xl:px-44">
      <div className='text-4xl font-extrabold pb-2'>
        {story.title}
      </div>
      {cards.length > 0 && currentCardIndex < cards.length && (
        <>
          <div className='text-xl text-gray-500 pb-3'>
            {cards[currentCardIndex].title}
          </div>
          <div className='md:px-16 lg:px-24 mb-3'>
            <BlocksList card={cards[currentCardIndex]} blockContentTypeId={blockContentTypeId} />
          </div>
          <div className='flex justify-center items-center p-2 mt-4 md:mt-8 '>
            <div className='flex items-center'>
              <div className={`p-2 md:p-3 ${story.user_has_liked.disliked ? 'text-[#3DB1FF] bg-[#D8EFFF]' : 'text-gray-500 bg-white'} border rounded-l-lg hover:text-[#3DB1FF] hover:bg-[#D8EFFF] hover:cursor-pointer`}
                onClick={() => handleLikeOrDislike(false)}>
                <FaThumbsDown className='text-lg md:text-xl' />
              </div>
              <div className='flex items-center p-2 md:p-3 text-gray-500 bg-white border hover:text-[#3DB1FF] hover:bg-[#D8EFFF] hover:cursor-pointer'
                onClick={goToFirstCard}>
                <FaAngleDoubleLeft className='text-lg md:text-xl' />
              </div>
              <div className='flex items-center p-2 md:p-3 text-gray-500 bg-white border rounded-r-lg hover:text-[#3DB1FF] hover:bg-[#D8EFFF] hover:cursor-pointer'
                onClick={goToPreviousCard}>
                <FaAngleLeft className='text-lg md:text-xl md:mr-2' />
                <span className='text-sm md:text-base hidden md:block' style={{ lineHeight: '1' }}>Previous</span>
              </div>
            </div>
            <Link to={`/topic/${story.topic}`} className='mx-2 md:mx-6'>
              <div className='p-2 md:p-3 text-gray-500 bg-gray-200 border rounded-lg'><FaArrowLeft className='text-base md:text-xl' /></div>
            </Link>
            <div className='flex items-center'>
              <div className='flex items-center justify-center p-2 md:p-3 text-gray-500 bg-white border rounded-l-lg hover:text-[#3DB1FF] hover:bg-[#D8EFFF] hover:cursor-pointer'
                onClick={goToNextCard}>
                <FaAngleRight className='text-lg md:text-xl md:mr-2' />
                <span className='text-sm md:text-base hidden md:block' style={{ lineHeight: '1' }}>Next</span>
              </div>
              <div className='flex items-center p-2 md:p-3 text-gray-500 bg-white border hover:text-[#3DB1FF] hover:bg-[#D8EFFF] hover:cursor-pointer'
                onClick={goToLastCard}>
                <FaAngleDoubleRight className='text-lg md:text-xl' />
              </div>
              <div className={`p-2 md:p-3 ${story.user_has_liked.liked ? 'text-[#3DB1FF] bg-[#D8EFFF]' : 'text-gray-500 bg-white'} border rounded-r-lg hover:text-[#3DB1FF] hover:bg-[#D8EFFF] hover:cursor-pointer`}
                onClick={() => handleLikeOrDislike(true)}>
                <FaThumbsUp className='text-lg md:text-xl' />
              </div>
            </div>
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
              <InteractBox user_has_recalled={cards[currentCardIndex].user_has_recalled.recall}
                recall_level={cards[currentCardIndex].user_has_recalled.level}
                recall_id={cards[currentCardIndex].user_has_recalled.recall_id}
                card_id={cards[currentCardIndex].id}
                onUpdateRecall={updateCardRecallStatus} />
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
    </div>
  )
}
