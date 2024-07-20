import React, { useEffect, useState } from 'react'
import { deleteLike, getBlocksByCard, likeSomething } from '../../api/blog.api';
import { FaUser } from 'react-icons/fa';
import { MonsterMentorProfileModal } from './MonsterMentorProfileModal';
import { BsDot, BsThreeDotsVertical } from "react-icons/bs";
import MarkdownRenderer from '../MardownRenderer';
import { ActionIcons } from './ActionIcons';


const ImageContainer = ({ image }) => (
  image ? (
    <div className='py-4 border-t-2 mt-4'>
      <img src={image} alt="Block" className=" max-w-full rounded-xl"/>
    </div>
  ) : null
);

const BlockContainer = ({ children, color, additionalClass, hasLiked, userHasRecalled, onLikeClick, isAuthenticated, content, block_id, onRecallUpdate, image }) => {

  const [showActionIcons, setShowActionIcons] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setShowActionIcons(false);
  }, [block_id]);

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
        <div className={`flex-grow p-4 bg-gray-50 shadow rounded-2xl border-[4px] ${additionalClass}`} style={{ borderColor: color || "#3DB1FF" }}>
          <MarkdownRenderer content={children} />
          <ImageContainer image={image}/>
        </div>
        <div className='flex items-center'>
          {showActionIcons ?
            <BsDot className="text-2xl cursor-pointer text-gray-500" onClick={handleToggleActionIcons} /> :
            <BsThreeDotsVertical className="text-2xl cursor-pointer text-gray-500" onClick={handleToggleActionIcons} />}
        </div>
      </div>
      {isAuthenticated && showActionIcons &&
        <ActionIcons hasLiked={hasLiked} onLikeClick={onLikeClick} isCopied={isCopied} copyToClipboard={copyToClipboard}
          userHasRecalled={userHasRecalled} block_id={block_id} onRecallUpdate={onRecallUpdate} />}
    </div>
  )

};

function NormalBlock({ content, image, color, user_has_liked, user_has_recalled, onLikeClick, isAuthenticated, block_id,
  onRecallUpdate }) {
  const hasLiked = user_has_liked !== false;
  return (
    <div>
      <BlockContainer color={color}
        hasLiked={hasLiked}
        userHasRecalled={user_has_recalled}
        onLikeClick={onLikeClick}
        isAuthenticated={isAuthenticated}
        block_id={block_id}
        image={image}
        onRecallUpdate={onRecallUpdate}
        content={content}>{content}
      </BlockContainer>
    </div>
  )
}

function AttackBlock({ content, color, image, monster_image, monster_name, monster_profile, user_has_liked,
  user_has_recalled, onLikeClick, soft_skill_name, soft_skill_description, soft_skill_logo, isAuthenticated, block_id,
  onRecallUpdate }) {
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
      <div className=''>
        <div className='pb-1 flex justify-end items-center'>
          <div className='text-end text-sm md:text-base'>
            <div className='font-bold'>{monster_name}</div>
            <div className='text-gray-500'>{soft_skill_name}</div>
          </div>
          <div className=''>
            {monster_image ? (
              <img src={monster_image} alt="Monster"
                className="h-10 w-10 md:h-14 md:w-14 rounded-full ms-2 border-[3px] cursor-pointer"
                style={{ borderColor: color }}
                onClick={() => openModal()} />
            ) : <FaUser />}
          </div>
        </div>
        <div className="pe-4 md:pe-6">
          <BlockContainer color={color} hasLiked={hasLiked} onLikeClick={onLikeClick} additionalClass="rounded-tr-none"
            isAuthenticated={isAuthenticated} content={content} userHasRecalled={user_has_recalled} block_id={block_id}
            onRecallUpdate={onRecallUpdate} image={image}> 
            {content}
          </BlockContainer>
        </div>
      </div>
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
  user_has_recalled, onLikeClick, isAuthenticated, block_id, onRecallUpdate }) {
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
      <div className=''>
        <div className='pb-1 flex items-center'>
          <div className=''>
            {mentor_image ? (
              <img src={mentor_image} alt="Mentor"
                className="h-10 w-10 md:h-14 md:w-14 rounded-full me-2 border-[3px] cursor-pointer"
                onClick={() => openModal()}
                style={{ borderColor: color }} />
            ) : <FaUser />}
          </div>
          <div className='text-sm md:text-base'>
            <div className='font-bold'>{mentor_name}</div>
            <div className='text-gray-500'>{mentor_job}</div>
          </div>
        </div>

        <div className='ps-8 md:ps-12'>
          <BlockContainer color={color} hasLiked={hasLiked} onLikeClick={onLikeClick} additionalClass="rounded-tl-none"
            isAuthenticated={isAuthenticated} content={content} userHasRecalled={user_has_recalled} block_id={block_id}
            onRecallUpdate={onRecallUpdate} image={image}>
            {content}
          </BlockContainer>
        </div>
      </div>
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

function getBlockComponent(block, card, handleLikeClick, isAuthenticated, onRecallUpdate) {
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
          {getBlockComponent(block, card, handleLikeClick, isAuthenticated, handleRecallUpdate)}
        </React.Fragment>
      ))}
    </div>
  )
}
