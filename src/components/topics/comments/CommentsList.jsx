import React, { useEffect, useState } from 'react'
import { FaAngleDown, FaAngleUp } from 'react-icons/fa'
import InfiniteScroll from "react-infinite-scroll-component";
import { getCommentsByStory } from '../../../api/blog.api';
import { CommentCard } from './CommentCard';
import { CommentBox } from './CommentBox';
import { getUser } from '../../../api/users.api';
import { COMMENTOR_LEVEL_1 } from '../../../globals';


export function CommentsList({ storyId, commentContentTypeId }) {
  const [comments, setComments] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCommentor, setIsCommentor] = useState(false);
  const [replyToCommentId, setReplyToCommentId] = useState(null);
  const [replyingToText, setReplyingToText] = useState('');
  const [newest, setNewest] = useState(false);
  const [icon, setIcon] = useState(<FaAngleUp />);

  useEffect(() => {
    setComments([]);
    setCurrentPage(1);
    setHasMore(true);
    loadComments(1);
  }, [storyId]);

  useEffect(() => {
    const isAuthenticated = Boolean(localStorage.getItem('token'));
    if (isAuthenticated) {
      checkIfUserIsCommentor();
    }
    loadInitialComments();
  }, []);

  useEffect(() => {
    if (currentPage > 1) {
      loadComments(currentPage);
    }
  }, [currentPage]);

  const reloadComments = (newestValue) => {
    setCurrentPage(1);
    loadComments(1, newestValue);
  };

  const loadInitialComments = async () => {
    setCurrentPage(1);
    await loadComments(1);
  };


  const toggleNewness = () => {
    const newNewestValue = !newest;
    setNewest(newNewestValue);
    setIcon(newNewestValue ? <FaAngleDown /> : <FaAngleUp />);
    reloadComments(newNewestValue);
  }

  async function loadComments(page, newestValue = newest) {
    try {
      const res = await getCommentsByStory(storyId, page, newestValue);
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

  const handleReplyClick = (parentId, parentText) => {
    setReplyToCommentId(parentId);
    setReplyingToText(parentText);
    scrollToCommentBox();
  };

  const scrollToCommentBox = () => {
    const navbarHeight = 120;
    const element = document.getElementById("commentArea");
    if (element) {
      const position = element.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({
        top: position,
        behavior: 'smooth'
      });
      setTimeout(() => element.focus(), 500);
    }
  };

  async function checkIfUserIsCommentor() {
    try {
      const userRes = await getUser();
      if (userRes.data.user_level_display.level_value >= COMMENTOR_LEVEL_1) {
        setIsCommentor(true);
      }
    } catch (error) {
      console.error("You don't have the permissions to comment.", error);
    }
  }

  return (
    <div className=' bg-white rounded-lg p-4' id='commentBox'>
      <div>
        {isCommentor && <CommentBox storyId={storyId}
          parentCommentId={replyToCommentId}
          setParentCommentId={setReplyToCommentId}
          replyingToText={replyingToText}
          setReplyingToText={setReplyingToText}
          onCommentSubmit={reloadComments} />}
      </div>
      <div className="flex justify-between">
        <div className='font-bold'>Story comments</div>
        <div className='flex justify-center items-center text-gray-500 cursor-pointer' onClick={toggleNewness}>
          Newness <span>{icon}</span>
        </div>
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
            <CommentCard
              key={comment.id}
              comment={comment}
              isReply={false}
              onReply={handleReplyClick}
              commentContentTypeId={commentContentTypeId} />
          ))}
        </InfiniteScroll>
      </div>

    </div>
  )
}
