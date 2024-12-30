import React, { useEffect, useState } from 'react'
import { FaXmark } from "react-icons/fa6";

import { BLOCK_TYPES } from '../../globals';
import { getMentor, getSoftSkill } from '../../api/base.api';
import { HeroBlock } from '../blocks/HeroBlock';
import { MentorBlock } from '../blocks/MentorBlock';
import { MonsterBlock } from '../blocks/MonsterBlock';
import { StandardBlock } from '../blocks/StandardBlock';
import { HighlightBlock } from '../blocks/HighlightBlock';
import { QuoteBlock } from '../blocks/QuoteBlock';
import { TestimonialBlock } from '../blocks/TestimonialBlock';
import { WonderBlock } from '../blocks/WonderBlock';
import { FactBlock } from '../blocks/FactBlock';


export function CardPreviewModal({ onClose, card, userPicture, userColor }) {

  const [blocks, setBlocks] = useState(null);
  const [softSkill, setSoftSkill] = useState(null);
  const [mentor, setMentor] = useState(null);
  console.log(card.blocks);
  
  useEffect(() => {
    if (card.blocks && card.blocks.length > 0) {
      setBlocks(card.blocks);
    }

    const fetchData = async () => {
      try {

        if (card.selectedSoftSkill) {
          const softSkillResponse = await getSoftSkill(card.selectedSoftSkill);
          setSoftSkill(softSkillResponse.data);
        }

        if (card.selectedMentor) {
          const mentorResponse = await getMentor(card.selectedMentor);
          setMentor(mentorResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [card]);


  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const getBlockTypeName = (blockTypeId) => {
    return BLOCK_TYPES[blockTypeId] || "STANDARD";
  };
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={handleBackdropClick}>
      <div className="mt-24 mx-auto border w-11/12 md:w-5/6 shadow-lg rounded-md bg-white p-3" onClick={handleModalClick}>
        <div>
          <div className='text-gray-500 flex justify-end cursor-pointer hover:text-gray-600' onClick={onClose}>
            <FaXmark className='text-2xl' />
          </div>
          <div className='text-2xl text-gray-500'>{card.cardTitle}</div>
          <div className='bg-white rounded-md border py-4 px-2 my-4'>
            {blocks && card.blocks && card.blocks.length > 0 && softSkill && mentor && blocks.map((block, index) => (
              <div key={index} className='py-4'>
                {getBlockTypeName(block.blockType) === "MONSTER" ? (
                  <MonsterBlock
                    content={block.content}
                    image={block.image}
                    color={softSkill.color}
                    monster_image={softSkill.monster_picture}
                    monster_name={softSkill.monster_name}
                    monster_profile={softSkill.color}
                    soft_skill_name={softSkill.name}
                    soft_skill_description={softSkill.description}
                    soft_skill_logo={softSkill.logo}
                    isPreview={true}
                  />
                ) : getBlockTypeName(block.blockType) === "MENTOR" ? (
                  <MentorBlock
                    content={block.content}
                    image={block.image}
                    color={mentor.color}
                    mentor_image={mentor.picture}
                    mentor_name={mentor.name}
                    mentor_job={mentor.job}
                    mentor_profile={mentor.profile}
                    isPreview={true}
                  />
                ) : getBlockTypeName(block.blockType) === "HERO" ? (
                  <HeroBlock
                    content={block.content}
                    image={block.image}
                    color={mentor.color}
                    ownerAvatar={userPicture}
                    isPreview={true}
                  />
                ) : getBlockTypeName(block.blockType) === "QUOTE" ? (
                  <QuoteBlock
                    content={block.content}
                    image={block.image}
                    authorName={block.quoted_by}
                    authorPicture={block.image_2}
                    color={mentor.color}
                    ownerAvatar={userPicture}
                    isPreview={true}
                  />
                ) : getBlockTypeName(block.blockType) === "HIGHLIGHT" ? (
                  <HighlightBlock
                    content={block.content}
                    image={block.image}
                    color={mentor.color}
                    ownerColor={userColor}
                    isPreview={true}
                  />
                ) : getBlockTypeName(block.blockType) === "TESTIMONIAL" ? (
                  <TestimonialBlock
                    content={block.content}
                    image={block.image}
                    color={mentor.color}
                    blockColor={block.block_color_string}
                    isPreview={true}
                  />
                ) : getBlockTypeName(block.blockType) === "WONDER" ? (
                  <WonderBlock
                    content={block.content}
                    image={block.image}
                    blockTitle={block.title}
                    isPreview={true}
                  />
                ) : getBlockTypeName(block.blockType) === "FACT" ? (
                  <FactBlock
                    content={block.content}
                    image={block.image}
                    color={mentor.color}
                    contentClass={block.content_class || "FACT"}
                    isPreview={true}
                  />
                ) : (<StandardBlock
                  content={block.content}
                  image={block.image}
                  color={softSkill.color}
                  isPreview={true}
                />)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}