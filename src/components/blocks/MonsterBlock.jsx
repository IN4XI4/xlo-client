import { useState } from "react";
import { MonsterMentorProfileModal } from "../topics/MonsterMentorProfileModal";
import { FaUser } from 'react-icons/fa';

import { BlockContainer } from "./BlockContainer";

export function MonsterBlock({ content, color, image, monster_image, monster_name, monster_profile, user_has_liked,
  user_has_recalled, onLikeClick, soft_skill_name, soft_skill_description, soft_skill_logo, isAuthenticated, block_id,
  onRecallUpdate, isPreview = false, isRecall = false  }) {
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
          <div className=' flex-none'>
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
            onRecallUpdate={onRecallUpdate} image={image} isPreview={isPreview} isRecall={isRecall}>
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