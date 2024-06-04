import React, { useEffect, useState } from 'react'
import { deleteLike, getBlocksByCard, likeSomething } from '../../api/blog.api';
import { FaCheck, FaHeart, FaRegBookmark, FaRegCopy, FaRegHeart, FaReply, FaUser } from 'react-icons/fa';
import { MonsterMentorProfileModal } from './MonsterMentorProfileModal';
import { BsDot, BsThreeDotsVertical } from "react-icons/bs";


const ActionIcons = ({ hasLiked, onLikeClick, isCopied, copyToClipboard }) => {
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
    <div className='flex justify-end space-x-2 items-center text-gray-500 py-1'>
      {isCopied ? <FaCheck className='md:text-xl cursor-pointer' onClick={copyToClipboard} /> :
        <FaRegCopy className='md:text-xl cursor-pointer' onClick={copyToClipboard} />}
      {/* {hasLiked ? <FaHeart className='text-xl cursor-pointer' onClick={onLikeClick} />
        : <FaRegHeart className='text-xl cursor-pointer' onClick={onLikeClick} />} */}
      <FaRegBookmark className='md:text-xl cursor-pointer' />
      <FaReply className='md:text-xl cursor-pointer' onClick={scrollToCommentBox} />
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

const BlockContainer = ({ children, color, additionalClass, hasLiked, onLikeClick, isAuthenticated, content }) => {

  const [showActionIcons, setShowActionIcons] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleToggleActionIcons = () => {
    setShowActionIcons(!showActionIcons);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 5000);
      })
      .catch((error) => {
        console.error('Error copying content to clipboard', error);
      });
  };

  return (
    <div className='pb-4'>
      <div className="flex">
        <div className='flex items-center '>
          {showActionIcons ?
            <BsDot className="text-2xl cursor-pointer text-gray-500" onClick={handleToggleActionIcons} /> :
            <BsThreeDotsVertical className="text-2xl cursor-pointer text-gray-500" onClick={handleToggleActionIcons} />}
        </div>
        <div className={`flex-grow p-4 bg-gray-50 shadow rounded-[2.5rem] border-[6px] ${additionalClass}`} style={{ borderColor: color || "#3DB1FF" }}>
          {children}
        </div>
      </div>
      {isAuthenticated && showActionIcons &&
        <ActionIcons hasLiked={hasLiked} onLikeClick={onLikeClick} isCopied={isCopied} copyToClipboard={copyToClipboard} />}
    </div>
  )

};

function NormalBlock({ content, image, color, user_has_liked, onLikeClick, isAuthenticated }) {
  const hasLiked = user_has_liked !== false;
  return (
    <div>
      <BlockContainer color={color}
        hasLiked={hasLiked}
        onLikeClick={onLikeClick}
        isAuthenticated={isAuthenticated}
        content={content}>{content}</BlockContainer>
      <ImageContainer image={image} color={color} />
    </div>
  )
}

function AttackBlock({ content, color, image, monster_image, monster_name, monster_profile, user_has_liked,
  onLikeClick, soft_skill_name, soft_skill_description, soft_skill_logo, isAuthenticated }) {
  const hasLiked = user_has_liked !== false;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <div className='flex'>
        <div className="flex-grow ">
          <BlockContainer color={color} hasLiked={hasLiked} onLikeClick={onLikeClick} additionalClass="rounded-tr-none"
            isAuthenticated={isAuthenticated} content={content}>
            <div className='font-bold text-end text-gray-700'>{monster_name}</div>
            {content}
          </BlockContainer>
        </div>
        <div className='flex-none pt-1 '>
          {monster_image ? (
            <img src={monster_image} alt="Monster"
              className="h-14 w-14 rounded-full mx-3 border-[3px] cursor-pointer"
              style={{ borderColor: color }}
              onClick={() => openModal()} />
          ) : <FaUser />}
        </div>
      </div>
      <ImageContainer image={image} color={color} />
      {isModalOpen && <MonsterMentorProfileModal
        image={monster_image}
        name={monster_name}
        profile={monster_profile}
        color={color}
        onClose={closeModal}
        soft_skill_name={soft_skill_name}
        soft_skill_description={soft_skill_description}
        soft_skill_logo={soft_skill_logo}
        isMonster={true}
      />}
    </div>
  );
}

function DefenseBlock({ content, image, color, mentor_image, mentor_name, mentor_job, mentor_profile, user_has_liked,
  onLikeClick, isAuthenticated }) {
  const hasLiked = user_has_liked !== false;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div>
      <div className='flex'>
        <div className='flex-none pt-1'>
          {mentor_image ? (
            <img src={mentor_image} alt="Mentor"
              className="h-14 w-14 rounded-full mx-3 border-[3px] cursor-pointer"
              onClick={() => openModal()}
              style={{ borderColor: color }} />
          ) : <FaUser />}
        </div>
        <div className='flex-grow'>
          <BlockContainer color={color} hasLiked={hasLiked} onLikeClick={onLikeClick} additionalClass="rounded-tl-none"
            isAuthenticated={isAuthenticated} content={content}>
            <div className='font-bold text-gray-700 ps-1'>{mentor_name}</div>
            <div className='font-bold text-gray-700 pb-1 ps-1'>{mentor_job}</div>
            {content}
          </BlockContainer>
        </div>
      </div>
      <ImageContainer image={image} color={color} />
      {isModalOpen && <MonsterMentorProfileModal
        image={mentor_image}
        name={mentor_name}
        job={mentor_job}
        profile={mentor_profile}
        color={color}
        onClose={closeModal}
        isMonster={false} />}
    </div>
  );
}

function getBlockComponent(block, card, handleLikeClick, isAuthenticated) {
  const commonProps = {
    content: block.content,
    image: block.image,
    user_has_liked: block.user_has_liked,
    onLikeClick: () => handleLikeClick(block.id, block.user_has_liked),
    isAuthenticated,
  };
  switch (block.block_type_name.toLowerCase()) {
    case 'attack':
      return <AttackBlock {...commonProps}
        color={card.soft_skill_color}
        monster_image={card.soft_skill_monster_picture}
        monster_name={card.soft_skill_monster_name}
        monster_profile={card.soft_skill_monster_profile}
        soft_skill_name={card.soft_skill_name}
        soft_skill_description={card.soft_skill_description}
        soft_skill_logo={card.soft_skill_logo} />;
    case 'defense':
      return <DefenseBlock {...commonProps}
        color={card.mentor_color}
        mentor_image={card.mentor_picture}
        mentor_name={card.mentor_name}
        mentor_job={card.mentor_job}
        mentor_profile={card.mentor_profile} />;
    default:
      return <NormalBlock {...commonProps} color={card.soft_skill_color} />;
  }
}

export function BlocksList({ card, blockContentTypeId }) {
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



  return (
    <div className='bg-white rounded-lg p-4 md:p-8 lg:p-12'>
      {blocks.map((block, index) => (
        <React.Fragment key={index}>
          {getBlockComponent(block, card, handleLikeClick, isAuthenticated)}
        </React.Fragment>
      ))}
    </div>
  )
}
