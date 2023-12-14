import React, { useEffect, useState } from 'react'
import InfiniteScroll from "react-infinite-scroll-component";
import { CommentCard } from './CommentCard';
import { getReplies } from '../../../api/blog.api';


export function RepliesList({ commentId, onReply }) {
  const [replies, setReplies] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    loadReplies(currentPage);
  }, [currentPage]);

  async function loadReplies(page) {
    try {
      const res = await getReplies(commentId, page);
      if (res.data.results.length > 0) {
        setReplies(prevComments => page === 1 ? res.data.results : [...prevComments, ...res.data.results]);
        setHasMore(!!res.data.next);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Error al cargar comentarios', error);
      setHasMore(false);
    }
  }
  return (
    <div>
      <div>
        <InfiniteScroll
          dataLength={replies.length}
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
          {replies.map(reply => (
            <CommentCard key={reply.id} comment={reply} isReply={true} onReply={onReply}/>
          ))}
        </InfiniteScroll>
      </div>
    </div>
  )
}
