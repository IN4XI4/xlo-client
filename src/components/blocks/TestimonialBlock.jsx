import React from 'react'
import { BlockContainer } from "./BlockContainer";
import MarkdownRenderer from "../MardownRenderer";
import { ImageContainer } from "./ImageContainer";
import TestimonialIcon from "../../assets/TestimonialIcon.svg"

const TestimonialContent = ({ children, color, additionalClass, image, blockColor }) => (
  <div
    className={`flex-grow p-4 bg-gray-50 shadow rounded-2xl border-[4px] ${additionalClass}`}
    style={{ borderColor: color || "#3DB1FF", backgroundColor: blockColor }}
  >
    <div className='flex items-center'>
      <img src={TestimonialIcon} alt="" className='h-14 w-14 md:h-20 md:w-20 pe-2 md:pe-4' />
      <MarkdownRenderer content={children} additionalClass="font-serif text-lg" />
    </div>
    <ImageContainer image={image} />
  </div>
);


export function TestimonialBlock({ content, image, color, user_has_liked, user_has_recalled, onLikeClick, isAuthenticated, block_id,
  onRecallUpdate, blockColor, isPreview = false, isRecall = false }) {
  const hasLiked = user_has_liked !== false;

  return (
    <div>
      <BlockContainer color={color}
        CustomContent={TestimonialContent}
        hasLiked={hasLiked}
        userHasRecalled={user_has_recalled}
        onLikeClick={onLikeClick}
        isAuthenticated={isAuthenticated}
        block_id={block_id}
        image={image}
        blockColor={blockColor}
        isPreview={isPreview}
        isRecall={isRecall}
        onRecallUpdate={onRecallUpdate}
        content={content}>{content}
      </BlockContainer>
    </div>
  )
}