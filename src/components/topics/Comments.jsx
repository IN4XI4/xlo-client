import React, { useEffect, useState } from 'react'
import { FaAngleDown } from 'react-icons/fa'
import InfiniteScroll from "react-infinite-scroll-component";
import { getCommentsByStory } from '../../api/blog.api';
import { CommentCard } from './CommentCard';
import { CommentBox } from './CommentBox';
import { getUser } from '../../api/users.api';


export function Comments({ storyId }) {
  const [comments, setComments] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCommentor, setIsCommentor] = useState(false);

  useEffect(() => {
    loadComments();
    checkIfUserIsCommentor();
  }, [currentPage]);

  async function loadComments() {
    const res = await getCommentsByStory(storyId, currentPage);
    setComments([...comments].concat(res.data.results));
    if (!res.data.next) {
      setHasMore(false);
    }
  }

  async function checkIfUserIsCommentor() {
    try {
      const userRes = await getUser();
      if (userRes.data.is_commentor) {
        setIsCommentor(true);
      }
    } catch (error) {
      console.error('Error al obtener información del usuario', error);
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
              <b>You have seen it all...</b>
            </p>
          }
        >
          {comments.map(comment => (
            <CommentCard key={comment.id} comment={comment} />
          ))}
        </InfiniteScroll>
      </div>
      <div>
        {isCommentor && <CommentBox />}
      </div>
    </div>
  )
}
