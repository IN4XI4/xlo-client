import { useState } from "react";
import { BlockContainer } from "./BlockContainer";
import MarkdownRenderer from "../MardownRenderer";
import { ImageContainer } from "./ImageContainer";
import { RiQuestionnaireFill } from "react-icons/ri";


const FactContent = ({ color, children, additionalClass, image, contentClass }) => {
  const [response, setResponse] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleButtonClick = (selectedClass) => {
    if (isAnswered) return;
    if (selectedClass === contentClass) {
      setResponse({ message: `It's true, that's a ${contentClass}!`, isCorrect: true });
    } else {
      setResponse({ message: `It's false, that's a ${contentClass}!`, isCorrect: false });
    }
    setIsAnswered(true);
  };

  return (
    <div className={`flex-grow p-4 bg-gray-50 shadow rounded-2xl border-[4px] ${additionalClass}`}
      style={{ borderColor: color || "#3DB1FF" }}>
      <MarkdownRenderer content={children} />
      <ImageContainer image={image} color={color} />
      <div className="mt-3 border-t-2 flex space-x-2 text-white pt-3 items-center flex-wrap text-sm md:text-base">
        <div className="flex p-2 bg-[#50326C] rounded-lg cursor-pointer" onClick={() => handleButtonClick("FACT")}>
          FACT <span className="ps-2"><RiQuestionnaireFill /></span>
        </div>
        <div className="flex p-2 bg-[#50326C] rounded-lg cursor-pointer" onClick={() => handleButtonClick("MYTH")}>
          MYTH <span className="ps-2"><RiQuestionnaireFill /></span>
        </div>
        <div className="flex p-2 bg-[#50326C] rounded-lg cursor-pointer" onClick={() => handleButtonClick("OPINION")}>
          OPINION <span className="ps-2"><RiQuestionnaireFill /></span>
        </div>
        {response && (
          <div className={`${response.isCorrect ? "text-[#3DB1FF]" : "text-[#FD4E3F]"} py-1`}>
            {response.message}
          </div>
        )}
      </div>
    </div>
  )
};


export function FactBlock({ content, image, color, user_has_liked, user_has_recalled, onLikeClick, isAuthenticated, block_id,
  onRecallUpdate, contentClass, isPreview = false, isRecall = false }) {
  const hasLiked = user_has_liked !== false;

  return (
    <div>
      <BlockContainer color={color}
        CustomContent={FactContent}
        hasLiked={hasLiked}
        userHasRecalled={user_has_recalled}
        onLikeClick={onLikeClick}
        isAuthenticated={isAuthenticated}
        contentClass={contentClass}
        block_id={block_id}
        image={image}
        isPreview={isPreview}
        isRecall={isRecall}
        onRecallUpdate={onRecallUpdate}
        content={content}>{content}
      </BlockContainer>
    </div>
  )
}

