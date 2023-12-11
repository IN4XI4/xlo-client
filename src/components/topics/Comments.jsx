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

  const reloadComments = () => {
    setCurrentPage(1);
    loadComments(1);
  };

  useEffect(() => {
    checkIfUserIsCommentor();
    loadInitialComments();
  }, []);

  const loadInitialComments = async () => {
    setCurrentPage(1);
    await loadComments(1);
  };

  useEffect(() => {
    if (currentPage > 1) {
      loadComments(currentPage);
    }
  }, [currentPage]);

  async function loadComments(page) {
    try {
      const res = await getCommentsByStory(storyId, currentPage);
      if (res.data.results.length > 0) {
        setComments(prevComments => page === 1 ? res.data.results : [...prevComments, ...res.data.results]);
        setHasMore(!!res.data.next);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error al cargar comentarios', error);
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
        {isCommentor && <CommentBox storyId={storyId} onCommentSubmit={reloadComments} />}
      </div>
    </div>
  )
}
