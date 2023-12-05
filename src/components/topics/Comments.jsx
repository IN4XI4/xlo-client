import React, { useEffect, useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import InfiniteScroll from "react-infinite-scroll-component";
import { getCommentsByStory } from '../../api/blog.api';
import { CommentCard } from './CommentCard';


export function Comments({ storyId }) {
  const [comments, setComments] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    loadComments();
  }, [currentPage]);

  async function loadComments() {
    const res = await getCommentsByStory(storyId, currentPage);
    console.log("res::::", res.data.results);
    setComments([...comments].concat(res.data.results));
    if (!res.data.next) {
      setHasMore(false);
    }
  }
  return (
    <div className=' bg-white rounded-lg p-4'>
      <div className="flex justify-between">
        <div className='font-bold'>Story comments</div>
        <div className='flex justify-center items-center text-gray-500'>Newness <span><FaAngleDown /></span></div>
      </div>
      <div>
        <InfiniteScroll
          dataLength={comments.length}
          scrollThreshold="95%"
          next={() => setCurrentPage(prevPage => prevPage + 1)}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p>
              <b>Yay! You have seen it all</b>
            </p>
          }
        >
          {comments.map(comment => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  )
}
