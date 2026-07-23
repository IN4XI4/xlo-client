import React, { useEffect, useState } from 'react'
import { getLikedTopicStories } from '../../api/blog.api';
import { StoriesListBox } from './StoriesListBox';


export function MyStoriesList({ searchText }) {
  const [stories, setStories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedButton, setSelectedButton] = useState('Latest');
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentPage === 1) return;
    loadStories(currentPage);
  }, [currentPage]);

  useEffect(() => {
    loadStories(1);
  }, [selectedButton, searchText]);

  async function loadStories(page) {
    try {
      const ordering = selectedButton === 'Latest' ? 'desc' : 'asc';
      const res = await getLikedTopicStories(page, ordering, searchText);
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
        error={error}
        setCurrentPage={setCurrentPage}
        handleButtonClick={handleButtonClick} />
    </div>
  )
}
