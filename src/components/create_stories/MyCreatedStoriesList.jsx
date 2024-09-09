import React, { useEffect, useState } from 'react'
import { getMyCreatedStories } from '../../api/blog.api';
import { StoriesListBox } from '../topics/StoriesListBox';


export function MyCreatedStoriesList({ searchText }) {
  const [stories, setStories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [selectedButton, setSelectedButton] = useState('Latest');

  useEffect(() => {
    loadStories(currentPage);
  }, [currentPage]);

  useEffect(() => {
    loadStories(1);
  }, [selectedButton, searchText]);

  async function loadStories(page) {
    try {
      const ordering = selectedButton === 'Latest' ? '-created_time' : 'created_time';
      const res = await getMyCreatedStories(page, ordering, searchText, true);

      if (page === 1) {
        setStories(res.data.results);
      } else {
        setStories(prevStories => [...prevStories, ...res.data.results]);
      }

      setHasMore(!!res.data.next);
      if (page === 1) {
        setCurrentPage(1);
      }
    } catch (error) {
      setError(error);
      setHasMore(false);
    }
  }

  const handleButtonClick = (buttonName) => {
    setSelectedButton(buttonName);
  }

  return (
    <div className='bg-white border rounded p-3 text-gray-500'>
      <StoriesListBox selectedButton={selectedButton}
        stories={stories}
        hasMore={hasMore}
        isOwner={true}
        error={error}
        setCurrentPage={setCurrentPage}
        handleButtonClick={handleButtonClick} />
    </div>
  )
}
