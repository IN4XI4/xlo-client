import React, { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component';

import { HeroBlock } from '../components/blocks/HeroBlock';
import { StandardBlock } from '../components/blocks/StandardBlock';
import { MonsterBlock } from '../components/blocks/MonsterBlock';
import { MentorBlock } from '../components/blocks/MentorBlock';
import { deleteLike, getMyRecallBlocksSparked, likeSomething } from '../api/blog.api';


export function SparkedRecallBlocksPage() {
  const [blocks, setBlocks] = useState([]);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [importanceOrder, setImportanceOrder] = useState('');
  const [createdTimeOrder, setCreatedTimeOrder] = useState('');
  const blockContentTypeId = 12;

  useEffect(() => {
    setImportanceOrder(getRandomImportanceValue());
    setCreatedTimeOrder(getRandomCreatedValue());
  }, []);

  useEffect(() => {
    if (importanceOrder && createdTimeOrder) {
      loadBlocks(currentPage);
    }
  }, [importanceOrder, createdTimeOrder, currentPage]);

  function getRandomImportanceValue() {
    const orderValues = ['importance_level', '-importance_level',];
    return orderValues[Math.floor(Math.random() * orderValues.length)];
  }
  function getRandomCreatedValue() {
    const orderValues = ['created_time', '-created_time'];
    return orderValues[Math.floor(Math.random() * orderValues.length)];
  }


  async function loadBlocks(page) {
    try {
      const res = await getMyRecallBlocksSparked(page, importanceOrder, createdTimeOrder);
      if (page === 1) {
        setBlocks(res.data.results);
      } else {
        setBlocks(prevStories => [...prevStories, ...res.data.results]);
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

  const handleLikeClick = async (blockId, userHasLiked) => {
    try {
      if (typeof userHasLiked === 'number') {
        await deleteLike(userHasLiked);
        updateBlockLikeState(blockId, false);
      } else {
        const data = {
          liked: true,
          content_type: blockContentTypeId,
          object_id: blockId,
          is_active: true
        };
        const response = await likeSomething(data);
        updateBlockLikeState(blockId, response.data.id);
      }
    } catch (error) {
      console.error("Error processing like/unlike:", error);
    }
  };

  const updateBlockLikeState = (blockId, likeState) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.block.id === blockId ? { ...block, block: { ...block.block, user_has_liked: likeState } } : block
      )
    );
  };

  return (
    <div className='pb-20 pt-24 md:pt-28 px-4 md:px-16 lg:px-32 xl:px-44'>
      <div className='text-xl font-semibold'>Welcome to the block recall</div>
      <div className='text-gray-500 truncate'>All your block content are located here...</div>
      <InfiniteScroll
        dataLength={blocks.length}
        next={() => setCurrentPage(prevPage => prevPage + 1)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        className='bg-white rounded-md border py-4 px-2 my-4'
        endMessage={
          <p>
            <b>You have seen it all...</b>
          </p>
        }
      >
        {blocks.map((block, index) => (
          <div key={index} className='pb-10'>
            {block.block.block_type_name === "MONSTER" ? (
              <MonsterBlock
                content={block.block.content}
                image={block.block.image}
                color={block.block.soft_skill_color}
                monster_image={block.block.soft_skill_monster_picture}
                monster_name={block.block.soft_skill_monster_name}
                monster_profile={block.block.soft_skill_monster_profile}
                soft_skill_name={block.block.soft_skill_name}
                soft_skill_description={block.block.soft_skill_description}
                soft_skill_logo={block.block.soft_skill_logo}
                user_has_liked={block.block.user_has_liked}
                user_has_recalled={block.block.user_has_recalled}
                onLikeClick={() => handleLikeClick(block.block.id, block.block.user_has_liked)}
                isRecall={true}
              />
            ) : block.block.block_type_name === "MENTOR" ? (
              <MentorBlock
                content={block.block.content}
                image={block.block.image}
                color={block.block.mentor_color}
                mentor_image={block.block.mentor_picture}
                mentor_name={block.block.mentor_name}
                mentor_job={block.block.mentor_job}
                mentor_profile={block.block.mentor_profile}
                user_has_liked={block.block.user_has_liked}
                user_has_recalled={block.block.user_has_recalled}
                onLikeClick={() => handleLikeClick(block.block.id, block.block.user_has_liked)}
                isRecall={true}
              />
            ) : block.block.block_type_name === "HERO" ? (
              <HeroBlock
                content={block.block.content}
                image={block.block.image}
                color={block.block.mentor_color}
                ownerAvatar={block.block.owner_picture}
                user_has_liked={block.block.user_has_liked}
                user_has_recalled={block.block.user_has_recalled}
                onLikeClick={() => handleLikeClick(block.block.id, block.block.user_has_liked)}
                isRecall={true}
              />
            ) : (<StandardBlock
              content={block.block.content}
              image={block.block.image}
              color={block.block.soft_skill_color}
              user_has_liked={block.block.user_has_liked}
              user_has_recalled={block.block.user_has_recalled}
              onLikeClick={() => handleLikeClick(block.block.id, block.block.user_has_liked)}
              isRecall={true}
            />)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  )
}