import React, { useEffect, useState } from 'react'
import { deleteLike, getBlocksByCard, likeSomething } from '../../api/blog.api';
import { FaHeart, FaRegBookmark, FaRegHeart, FaReply, FaUser } from 'react-icons/fa';


const ActionIcons = ({ hasLiked, onLikeClick }) => {
  const navbarHeight = 130;

  const scrollToCommentBox = () => {
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
  return (
    <div className='flex justify-end space-x-2 items-center text-gray-500 py-2'>
      {hasLiked ? <FaHeart className='text-xl cursor-pointer' onClick={onLikeClick} />
        : <FaRegHeart className='text-xl cursor-pointer' onClick={onLikeClick} />}
      <FaRegBookmark className='text-xl' />
      <FaReply className='text-xl cursor-pointer' onClick={scrollToCommentBox} />
      <div className='cursor-pointer' onClick={scrollToCommentBox}>Comment</div>
    </div>
  );
};

const ImageContainer = ({ image, color }) => (
  image ? (
    <div className='mb-3'>
      <img src={image} alt="Block" className=" max-w-full rounded-lg p-2 border-[6px]" style={{ borderColor: color || "#3DB1FF" }} />
    </div>
  ) : null
);

const BlockContainer = ({ children, color, additionalClass, hasLiked, onLikeClick }) => (
  <div className='mb-3'>
    <div className={`p-4 bg-gray-50 shadow rounded-[2.5rem] border-[6px] ${additionalClass}`} style={{ borderColor: color || "#3DB1FF" }}>
      {children}
    </div>
    <ActionIcons hasLiked={hasLiked} onLikeClick={onLikeClick}/>
  </div>
);

function NormalBlock({ content, image, color, user_has_liked, onLikeClick }) {
  const hasLiked = user_has_liked !== false;
  console.log(hasLiked);
  return (
    <div>
      <BlockContainer color={color} hasLiked={hasLiked} onLikeClick={onLikeClick}>{content}</BlockContainer>
      <ImageContainer image={image} color={color} />
    </div>
  )
}

function AttackBlock({ content, color, image, monster_image, monster_name, user_has_liked, onLikeClick }) {
  const hasLiked = user_has_liked !== false;
  return (
    <div className='flex'>
      <div className="flex-grow">
        <BlockContainer color={color} hasLiked={hasLiked} onLikeClick={onLikeClick} additionalClass="rounded-tr-none">
          <div className='font-bold text-end text-gray-700'>{monster_name}</div>
          {content}
        </BlockContainer>
      </div>
      <div className='flex-none pt-1'>
        {monster_image ? (
          <img src={monster_image} alt="Monster" className="h-14 w-14 rounded-full mx-3 border-[3px]" style={{ borderColor: color }} />
        ) : <FaUser />}
      </div>
      <ImageContainer image={image} color={color} />
    </div>
  );
}

function DefenseBlock({ content, image, color, mentor_image, mentor_name, mentor_job, user_has_liked, onLikeClick }) {
  const hasLiked = user_has_liked !== false;
  return (
    <div className='flex'>
      <div className='flex-none pt-1'>
        {mentor_image ? (
          <img src={mentor_image} alt="Mentor" className="h-14 w-14 rounded-full mx-3 border-[3px]" style={{ borderColor: color }} />
        ) : <FaUser />}
      </div>
      <div className='flex-grow'>
        <BlockContainer color={color} hasLiked={hasLiked} onLikeClick={onLikeClick} additionalClass="rounded-tl-none">
          <div className='font-bold text-gray-700 ps-1'>{mentor_name}</div>
          <div className='font-bold text-gray-700 pb-1 ps-1'>{mentor_job}</div>
          {content}
        </BlockContainer>
      </div>
      <ImageContainer image={image} color={color} />
    </div>
  );
}

function getBlockComponent(block, card, handleLikeClick) {
  const commonProps = {
    content: block.content,
    image: block.image,
    user_has_liked: block.user_has_liked,
    onLikeClick: () => handleLikeClick(block.id, block.user_has_liked)
  };
  switch (block.block_type_name.toLowerCase()) {
    case 'attack':
      return <AttackBlock {...commonProps} color={card.soft_skill_color} monster_image={card.soft_skill_monster_picture} monster_name={card.soft_skill_monster_name} />;
    case 'defense':
      return <DefenseBlock {...commonProps} color={card.mentor_color} mentor_image={card.mentor_picture} mentor_name={card.mentor_name} mentor_job={card.mentor_job} />;
    default:
      return <NormalBlock {...commonProps} color={card.soft_skill_color} />;
  }
}

export function BlocksList({ card, blockContentTypeId }) {
  const [blocks, setBlocks] = useState([]);
  const [error, setError] = useState(null);
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
        console.log("Like removed");
      } else {
        const data = {
          liked: true,
          content_type: blockContentTypeId,
          object_id: blockId,
          is_active: true
        };
        const response = await likeSomething(data);
        updateBlockLikeState(blockId, response.data.id);
        console.log("Block liked!");
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

  return (
    <div className='bg-white rounded-lg p-4 md:p-8 lg:p-12'>
      {blocks.map((block, index) => (
        <React.Fragment key={index}>
          {getBlockComponent(block, card, handleLikeClick)}
        </React.Fragment>
      ))}
    </div>
  )
}
