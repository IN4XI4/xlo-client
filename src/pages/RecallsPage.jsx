import React, { useEffect, useState } from 'react'
import { FaBookmark, FaRegTimesCircle } from 'react-icons/fa'
import { HiOutlineArrowLeftCircle, HiOutlineArrowRightCircle } from "react-icons/hi2";
import { deleteRecallCard, getMyRecallCards } from '../api/blog.api';
import { useLocation, useNavigate } from 'react-router-dom';
import { BlocksList } from '../components/topics/BlocksList';
import { getContentTypes } from '../api/base.api';
import { useAppState } from '../context/ScrollContext';


export function RecallsPage() {
  const [recallCards, setRecallCards] = useState([]);
  const [error, setError] = useState(null);
  const [isCardsLoaded, setIsCardsLoaded] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [blockContentTypeId, setBlockContentTypeId] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsScrolled, updateTitles } = useAppState();

  useEffect(() => {
    loadRecallCards();
  }, []);

  async function loadRecallCards() {
    try {
      const res = await getMyRecallCards();
      console.log(res.data);
      setRecallCards(res.data);
      setIsCardsLoaded(true);
    } catch (error) {
      setError(error);
    }
  }

  async function loadContentTypes() {
    try {
      const res = await getContentTypes();
      const contentTypes = res.data;
      const blockType = contentTypes.find(ct => ct.model === 'block');
      if (blockType) setBlockContentTypeId(blockType.id);
    } catch (error) {
      console.error('Error al cargar los ContentTypes', error);
    }
  }

  useEffect(() => {
    loadContentTypes();
  }, []);

  const goToNextCard = async () => {
    if (currentCardIndex < recallCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      window.scrollTo(0, 0);
    } else {
      setIsCardsLoaded(false);
      try {
        const res = await getMyRecallCards();
        if (res && res.data) {
          setRecallCards(res.data);
          setCurrentCardIndex(0);
        } else {
          console.error('No se pudieron recargar las tarjetas.');
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsCardsLoaded(true);
      }
    }
  };

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBackClick = () => {
    if (location.state?.fromNavigation) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setIsScrolled(position > 100);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [setIsScrolled]);

  useEffect(() => {
    if (recallCards.length > 0) {
      updateTitles('', recallCards[currentCardIndex].card.title);
    } else {
      updateTitles('', '');
    }
  }, [currentCardIndex, updateTitles]);

  const handleBookmarkClick = async () => {
    const currentCardId = recallCards[currentCardIndex].id;
    try {
      const res_delete = await deleteRecallCard(currentCardId)
      if (!res_delete && res_delete.status != 204) {
        console.error('Did not delete recall.');
      }
    } catch {
      setError(error);
    }
    const updatedCards = recallCards.filter(recallCard => recallCard.id !== currentCardId);
    setRecallCards(updatedCards);
    if (currentCardIndex < updatedCards.length) {
      setCurrentCardIndex(currentCardIndex);
    } else {
      setIsCardsLoaded(false);
      try {
        const res = await getMyRecallCards();
        if (res && res.data) {
          setRecallCards(res.data);
          setCurrentCardIndex(0);
        } else {
          console.error('Did not load cards.');
        }
      } catch (error) {
        setError(error);
      } finally {
        setIsCardsLoaded(true);
      }
    }

    window.scrollTo(0, 0);
  };

  return (
    <div className="pb-20 pt-24 md:pt-28 px-4 md:px-16 lg:px-32 xl:px-44">
      {!isCardsLoaded ? (
        <div>Loading...</div>
      ) : recallCards.length === 0 ? (
        <div className='text-2xl text-gray-500'>You have no recall cards.</div>
      ) : (
        <div>
          <div className='text-xl text-gray-500 pb-3'>
            {recallCards[currentCardIndex].card.title}
          </div>
          <div className='md:px-16 lg:px-24 mb-3'>
            <BlocksList key={recallCards[currentCardIndex].card.id}
              card={recallCards[currentCardIndex].card}
              blockContentTypeId={blockContentTypeId} />
          </div>
        </div>
      )}
      <div className="fixed inset-x-0 bottom-0 text-white text-center z-50">
        <div className='bg-[#0098FF] text-end px-4 text-sm'>
          Vous êtes en mode “Rappel”
        </div>
        <div className='bg-[#3DB1FF] px-4 flex py-1'>
          <div className='flex-none flex items-center w-1/4'>
            <FaBookmark className='cursor-pointer' onClick={handleBookmarkClick} />
            <span className="ml-2 font-thin text-sm">{recallCards.length} {recallCards.length === 1 ? 'card' : 'cards'}</span>
          </div>
          <div className='flex-grow items-center flex justify-center space-x-4 w-1/2'>
            <div>
              <HiOutlineArrowLeftCircle className='text-4xl cursor-pointer' onClick={goToPreviousCard} />
            </div>
            <div>
              <HiOutlineArrowRightCircle className='text-4xl cursor-pointer' onClick={goToNextCard} />
            </div>
          </div>
          <div className='flex-none  flex items-center w-1/4 justify-end'>
            <FaRegTimesCircle className='text-xl cursor-pointer' onClick={handleBackClick} />
          </div>
        </div>
      </div>
    </div>
  )
}
