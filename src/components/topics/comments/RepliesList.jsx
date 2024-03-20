import React, { useEffect, useState } from 'react';
import { CommentCard } from './CommentCard';
import { getReplies } from '../../../api/blog.api';

export function RepliesList({ commentId, onReply, commentContentTypeId }) {
  const [replies, setReplies] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadReplies = async () => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        const res = await getReplies(commentId, currentPage);
        if (res.data.results.length > 0) {
          setReplies(prevReplies => {
            const newReplies = res.data.results.filter(reply => !prevReplies.some(prevReply => prevReply.id === reply.id));
            return [...prevReplies, ...newReplies];
          });
          setHasMore(res.data.next !== null);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        console.error('Error al cargar los comentarios', error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadReplies();
  }, [currentPage, commentId]);

  const handleShowMore = () => {
    if (!isLoading) {
      setCurrentPage(prevPage => {
        return prevPage + 1;
      });
    }
  };

  return (
    <div>
      {replies.map(reply => (
        <CommentCard key={reply.id} comment={reply} isReply={true} onReply={onReply} commentContentTypeId={commentContentTypeId} />
      ))}
      {hasMore && !isLoading && (
        <div className="pt-2 flex justify-end">
          <button className="text-blue-500" onClick={handleShowMore}>
            -- Show 5 more --
          </button>
        </div>
      )}

    </div>
  );
}
