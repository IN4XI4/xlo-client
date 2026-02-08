import { useState } from "react";
import { BlockContainer } from "./BlockContainer";
import MarkdownRenderer from "../MardownRenderer";
import { ImageContainer } from "./ImageContainer";
import { IoSync } from "react-icons/io5";


const FlashcardContent = ({ children, additionalClass, color, image, content2, image2 }) => {

  const [isPrimaryActive, setIsPrimaryActive] = useState(true);

  const toggleContent = () => {
    setIsPrimaryActive((prev) => !prev);
  };

  return (
    <div
      className={`flex-grow p-2 shadow rounded-2xl border-[5px] ${additionalClass}`}
      style={{ borderColor: color || "#3DB1FF" }}
    >
      <div className="p-3 rounded-lg items-center">
        {isPrimaryActive ? (
          <>
            <MarkdownRenderer content={children} />
            <ImageContainer image={image} color={color} />
          </>
        ) : (
          <>
            <MarkdownRenderer content={content2} />
            <ImageContainer image={image2} color={color} />
          </>
        )}
      </div>
      <div className="flex justify-end items-center">
        <div
          className={`h-4 w-4 rounded-full me-2 cursor-pointer ${isPrimaryActive ? "bg-[#3DB1FF]" : "bg-gray-300"
            }`}
          onClick={() => setIsPrimaryActive(true)}
        ></div>
        <div
          className={`h-4 w-4 rounded-full me-2 cursor-pointer ${!isPrimaryActive ? "bg-[#3DB1FF]" : "bg-gray-300"
            }`}
          onClick={() => setIsPrimaryActive(false)}
        ></div>
        <div className="bg-[#3DB1FF] text-white text-xl rounded-full p-1 font-bold cursor-pointer"
          onClick={toggleContent}>
          <IoSync />
        </div>
      </div>
    </div>
  );
}


export function FlashcardBlock({ content, image, user_has_liked, user_has_recalled, onLikeClick, isAuthenticated, block_id,
  onRecallUpdate, color, content2, image2, isPreview = false, isRecall = false }) {
  const hasLiked = user_has_liked !== false;
  return (
    <div>
      <BlockContainer
        hasLiked={hasLiked}
        userHasRecalled={user_has_recalled}
        onLikeClick={onLikeClick}
        isAuthenticated={isAuthenticated}
        block_id={block_id}
        image={image}
        content2={content2}
        image2={image2}
        color={color}
        isPreview={isPreview}
        isRecall={isRecall}
        CustomContent={FlashcardContent}
        onRecallUpdate={onRecallUpdate}
        content={content}>{content}
      </BlockContainer>
    </div>
  )
}

