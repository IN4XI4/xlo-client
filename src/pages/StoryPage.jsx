import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { getCardsByStory, getStory } from '../api/blog.api';
import { BlocksList } from '../components/topics/BlocksList';


export function StoryPage() {
  const { id } = useParams();
  const [story, setStory] = useState([]);
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  useEffect(() => {
    loadStory();
  }, [id]);
  async function loadStory() {
    try {
      const res = await getStory(id);
      setStory(res.data);
      const cardsResponse = await getCardsByStory(id);
      setCards(cardsResponse.data.results);
      console.log("cards", cardsResponse.data.results);
    } catch (error) {
      setError(error);
    }
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
          <div className='md:px-24'>
            <BlocksList card={cards[currentCardIndex]} />
          </div>
        </>
      )}
    </div>
  )
}
