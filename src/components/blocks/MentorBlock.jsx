import { useState } from "react";

import { MonsterMentorProfileModal } from "../topics/MonsterMentorProfileModal";
import { FaUser } from 'react-icons/fa';
import { BlockContainer } from "./BlockContainer";


export function MentorBlock({ content, image, color, mentor_image, mentor_name, mentor_job, mentor_profile, user_has_liked,
  user_has_recalled, onLikeClick, isAuthenticated, block_id, onRecallUpdate, isPreview = false, isRecall = false }) {
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
            ) : <FaUser onClick={() => openModal()} className='cursor-pointer me-2' />}
          </div>
          <div className='text-sm md:text-base'>
            <div className='font-bold'>{mentor_name}</div>
            <div className='text-gray-500'>{mentor_job}</div>
          </div>
        </div>

        <div className='ps-8 md:ps-12'>
          <BlockContainer color={color} hasLiked={hasLiked} onLikeClick={onLikeClick} additionalClass="rounded-tl-none"
            isAuthenticated={isAuthenticated} content={content} userHasRecalled={user_has_recalled} block_id={block_id}
            onRecallUpdate={onRecallUpdate} image={image} isPreview={isPreview} isRecall={isRecall}>
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