import React, { useEffect, useState } from 'react'

import { MonsterBlock } from '../blocks/MonsterBlock';
import { MentorBlock } from '../blocks/MentorBlock';
import { QuoteBlock } from '../blocks/QuoteBlock';
import { StandardBlock } from '../blocks/StandardBlock';
import { HeroBlock } from '../blocks/HeroBlock';
import { HighlightBlock } from '../blocks/HighlightBlock';
import { TestimonialBlock } from '../blocks/TestimonialBlock';
import { deleteLike, getBlocksByCard, likeSomething } from '../../api/blog.api';

function getBlockComponent(block, card, handleLikeClick, isAuthenticated, onRecallUpdate, ownerAvatar, ownerColor) {
  const commonProps = {
    content: block.content,
    block_id: block.id,
    image: block.image,
    user_has_liked: block.user_has_liked,
    user_has_recalled: block.user_has_recalled,
    onLikeClick: () => handleLikeClick(block.id, block.user_has_liked),
    isAuthenticated,
    onRecallUpdate
  };

  switch (block.block_type_name.toLowerCase()) {
    case 'monster':
      return <MonsterBlock {...commonProps}
        color={card.soft_skill_color}
        monster_image={card.soft_skill_monster_picture}
        monster_name={card.soft_skill_monster_name}
        monster_profile={card.soft_skill_monster_profile}
        soft_skill_name={card.soft_skill_name}
        soft_skill_description={card.soft_skill_description}
        soft_skill_logo={card.soft_skill_logo} />;
    case 'mentor':
      return <MentorBlock {...commonProps}
        color={card.mentor_color}
        mentor_image={card.mentor_picture}
        mentor_name={card.mentor_name}
        mentor_job={card.mentor_job}
        mentor_profile={card.mentor_profile} />;
    case 'hero':
      return <HeroBlock {...commonProps} color={card.mentor_color} ownerAvatar={ownerAvatar} />;
    case 'quote':
      return (<QuoteBlock
        {...commonProps} color={card.soft_skill_color} authorName={block.quoted_by} authorPicture={block.image_2}
      />)
        ;
    case 'highlight':
      return <HighlightBlock {...commonProps} ownerColor={ownerColor} />;
    case 'testimonial':
      return <TestimonialBlock {...commonProps} blockColor={block.block_color_string} />;
    default:
      return <StandardBlock {...commonProps} color={card.soft_skill_color} />;
  }
}

export function BlocksList({ card, blockContentTypeId, ownerAvatar = null, ownerColor = null }) {
  const [blocks, setBlocks] = useState([]);
  const [error, setError] = useState(null);
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  useEffect(() => {
    if (card) {
      loadBlocks(card);
    }
  }, [card]);

  async function loadBlocks(card) {
    try {
      const res = await getBlocksByCard(card.id);
      setBlocks(res.data.results);
    } catch (error) {
      setError(error);
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
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return { ...block, user_has_liked: likeState };
      }
      return block;
    }));
  };

  const handleRecallUpdate = (blockId, recallState, recallLevel, recallId) => {
    setBlocks(blocks.map(block => {
      if (block.id === blockId) {
        return { ...block, user_has_recalled: { recall: recallState, level: recallLevel, recall_id: recallId } };
      }
      return block;
    }));
  };

  return (
    <div className='bg-white rounded-lg p-4 md:p-8 lg:p-12'>
      {blocks.map((block, index) => (
        <React.Fragment key={index}>
          {getBlockComponent(block, card, handleLikeClick, isAuthenticated, handleRecallUpdate, ownerAvatar, ownerColor)}
        </React.Fragment>
      ))}
    </div>
  )
}
