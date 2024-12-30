import { useEffect, useState } from "react";
import { BsDot, BsThreeDotsVertical } from "react-icons/bs";
import { FaRegBookmark, FaRegCopy, FaRegHeart, FaReply } from "react-icons/fa6";

import { ActionIcons } from "../topics/ActionIcons";
import MarkdownRenderer from "../MardownRenderer";
import { ImageContainer } from "./ImageContainer";


export const BlockContainer = ({ children, color, additionalClass, hasLiked, userHasRecalled, onLikeClick,
  isAuthenticated, content, block_id, onRecallUpdate, image, ownerAvatar = null, ownerColor = null, 
  CustomContent = DefaultContent, authorName = null, authorPicture = null, blockColor = null, blockTitle = null,
  contentClass = null, isPreview = false, isRecall = false }) => {
    
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
    <div className='pb-4' translate="no">
      <div className="flex">
        <CustomContent
          children={children}
          color={color}
          additionalClass={additionalClass}
          image={image}
          ownerAvatar={ownerAvatar}
          ownerColor={ownerColor}
          authorName={authorName}
          authorPicture={authorPicture}
          blockColor={blockColor}
          contentClass={contentClass}
          blockTitle={blockTitle}
        />
        <div className='flex items-center'>
          {showActionIcons ?
            <BsDot className="text-2xl cursor-pointer text-gray-500" onClick={handleToggleActionIcons} /> :
            <BsThreeDotsVertical className="text-2xl cursor-pointer text-gray-500" onClick={handleToggleActionIcons} />}
        </div>
      </div>
      {showActionIcons && (
        isRecall ? (
          <ActionIcons hasLiked={hasLiked} onLikeClick={onLikeClick} isCopied={isCopied}
            copyToClipboard={copyToClipboard} userHasRecalled={userHasRecalled} block_id={block_id}
            onRecallUpdate={() => { }} hideBookmarkAndReply={true} />
        ) : isPreview ? (
          <div className="flex text-gray-500 space-x-1 py-1 text-lg justify-end pe-6">
            <FaRegCopy className="cursor-pointer" />
            <FaRegBookmark className="cursor-pointer" />
            <FaRegHeart className="cursor-pointer" />
            <FaReply className="cursor-pointer" />
          </div>
        ) : (
          isAuthenticated && (
            <ActionIcons
              hasLiked={hasLiked}
              onLikeClick={onLikeClick}
              isCopied={isCopied}
              copyToClipboard={copyToClipboard}
              userHasRecalled={userHasRecalled}
              block_id={block_id}
              onRecallUpdate={onRecallUpdate}
            />
          )
        )
      )}
    </div>
  )
};

const DefaultContent = ({ children, color, additionalClass, image }) => (
  <div
    className={`flex-grow p-4 bg-gray-50 shadow rounded-2xl border-[4px] ${additionalClass}`}
    style={{ borderColor: color || "#3DB1FF" }}
  >
    <MarkdownRenderer content={children} />
    <ImageContainer image={image} />
  </div>
);