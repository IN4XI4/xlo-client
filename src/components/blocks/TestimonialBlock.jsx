import React from 'react'
import { BlockContainer } from "./BlockContainer";
import MarkdownRenderer from "../MardownRenderer";
import { ImageContainer } from "./ImageContainer";

const TestimonialContent = ({ children, additionalClass, image, blockColor }) => (
  <div
    className={`flex-grow p-4 bg-gray-50 shadow rounded-2xl ${additionalClass}`}
    style={{ backgroundColor: blockColor, boxShadow: `0 0 0 4px ${blockColor}66` }}
  >
    <div className='flex items-center pb-2'>
      <MarkdownRenderer content={children} additionalClass="font-serif text-lg text-white" />
    </div>
    <ImageContainer image={image} color={"#E5E7EB"} />
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