import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { HoverTooltip } from '../HoverTooltip';

import { getTopicTags } from '../../api/base.api';
import { deleteLike, likeSomething } from '../../api/blog.api';
import { TopicsTileV2Skeleton } from './TopicsTileV2Skeleton';

const SKELETON_COUNT = 3;


export function TopicsTileV2({ isAuthenticated, activeSpace }) {
  const [topicTags, setTopicTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadTopicTags();
  }, []);

  async function loadTopicTags() {
    try {
      const spaceId = activeSpace?.id ?? null;
      const res = await getTopicTags(spaceId);
      setTopicTags(res.data.results);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  }

  const updateTopicLikeState = (topicId, likeState) => {
    setTopicTags(currentTopicTags => currentTopicTags.map(topicTag => ({
      ...topicTag,
      topics: topicTag.topics.map(topic => {
        if (topic.id === topicId) {
          return { ...topic, user_has_liked: likeState };
        }
        return topic;
      })
    })));
  };

  const handleLikeClick = async (topicId, userHasLiked) => {
    try {
      if (typeof userHasLiked === 'number') {
        await deleteLike(userHasLiked);
        updateTopicLikeState(topicId, false);
      } else {
        const data = {
          liked: true,
          content_type: topicTags[0].topic_content_type_id,
          object_id: topicId,
          is_active: true
        };
        const response = await likeSomething(data);
        updateTopicLikeState(topicId, response.data.id);
      }
    } catch (error) {
      console.error("Error processing like/unlike:", error);
    }
  };

  const getStoryCount = (topicTag) =>
    topicTag.topics.reduce((total, topic) => total + (topic.story_count || 0), 0);

  const renderList = () => {
    if (loading) {
      return Array.from({ length: SKELETON_COUNT }).map((_, i) => (
        <TopicsTileV2Skeleton key={i} />
      ));
    }
    if (error) {
      return <div className='py-6 text-center text-[#19A2FF]'>Could not load categories</div>;
    }
    if (topicTags.length === 0) {
      return <div className='py-6 text-center text-[#19A2FF]'>No categories available</div>;
    }
    return topicTags.map(topicTag => (
      <div key={topicTag.id} className='py-3 border-b border-[#19A2FF]/30 last:border-b-0'
        style={{ "--tag-color": topicTag.color || "#19A2FF" }}>
        <div className='flex justify-between items-center gap-2 pb-2'>
          <div className='text-[#19A2FF] font-bold md:text-lg truncate'>{topicTag.name}</div>
          <div className='text-[#19A2FF] text-sm flex-shrink-0'>{getStoryCount(topicTag)} stories</div>
        </div>
        <div className='flex flex-wrap gap-2'>
          {topicTag.topics.map(topic => {
            const pill = (
              <div
                className='flex items-center gap-2 max-w-full bg-white rounded-full py-0.5 ps-1 pe-3 cursor-pointer border-2 border-transparent hover:border-gray-300'
                onClick={() => navigate(`/stories?topic=${topic.id}`)}
              >
                {topic.image ? (
                  <img src={topic.image} alt={topic.title} className='w-6 h-6 rounded-full object-cover flex-shrink-0' />
                ) : (
                  <div className='w-6 h-6 rounded-full bg-[var(--tag-color)] flex-shrink-0' />
                )}
                <div className='text-[0.7875rem] text-gray-500 truncate'>{topic.title}</div>
                {isAuthenticated && (topic.user_has_liked ? (
                  <FaHeart
                    className='text-[var(--tag-color)] text-sm flex-shrink-0'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeClick(topic.id, topic.user_has_liked);
                    }}
                  />
                ) : (
                  <FaRegHeart
                    className='text-gray-400 text-sm flex-shrink-0'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeClick(topic.id, false);
                    }}
                  />
                ))}
              </div>
            );
            return (
              <HoverTooltip
                key={topic.id}
                className='max-w-full'
                maxWidthClassName={topic.image ? 'max-w-[21.5rem]' : 'max-w-xs'}
                content={
                  <div className='flex items-center gap-2'>
                    {topic.image && (
                      <img src={topic.image} alt='' className='w-20 h-20 rounded-lg object-cover flex-shrink-0' />
                    )}
                    <div>
                      {topic.description && <div className='pb-1'>{topic.description}</div>}
                      <div className='font-semibold'>{topic.story_count} stories</div>
                    </div>
                  </div>
                }
              >
                {pill}
              </HoverTooltip>
            );
          })}
        </div>
      </div>
    ));
  };

  return (
    <div className='bg-[#19A2FF]/40 rounded-xl p-3 h-[32rem] flex flex-col'>
      <div className='text-[#19A2FF] font-bold md:text-xl xl:text-2xl border-b-2 border-[#19A2FF]'>
        Categories
      </div>
      <div className='text-end text-[#19A2FF] text-sm pb-1 cursor-pointer'
        onClick={() => navigate('/stories')}>
        [Browse every category & topic]
      </div>
      <div className='flex-1 overflow-y-auto min-h-0 pe-1'>
        {renderList()}
      </div>
      <div className='flex justify-center pt-3'>
        <button className='bg-[#19A2FF] text-white uppercase text-sm tracking-wide rounded-full px-8 py-2 hover:bg-[#0E8FE6]'
          onClick={() => navigate('/stories')}>
          See all categories
        </button>
      </div>
    </div>
  )
}
