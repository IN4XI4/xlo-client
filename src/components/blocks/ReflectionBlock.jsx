import { useState } from "react";
import { BlockContainer } from "./BlockContainer";
import MarkdownRenderer from "../MardownRenderer";
import { ImageContainer } from "./ImageContainer";
import ReflectionIcon from "../../assets/reflection.svg"
import FeedbackIcon from "../../assets/feedback.svg"

const ReflectionContent = ({ children, additionalClass, color, image, content2, image2 }) => {
  const [activeTab, setActiveTab] = useState(null);
  return (
    <div
      className={`flex-grow p-2 shadow rounded-2xl border-[5px] ${additionalClass}`}
      style={{ borderColor: color || "#3DB1FF" }}
    >
      <div className="flex justify-evenly">
        <div className="flex items-center text-[#657DFF] text-base md:text-xl font-serif italic font-bold cursor-pointer"
          onClick={() => setActiveTab("reflection")}>
          <span className="pe-2 md:pe-3"><img src={ReflectionIcon} alt="" className='h-8 md:h-14 w-8 md:w-14' /></span> Reflection
        </div>
        <div className="flex items-center text-[#38AFFF] text-base md:text-xl font-serif italic font-bold cursor-pointer"
          onClick={() => setActiveTab("feedback")}>
          <span className="pe-2 md:pe-3"><img src={FeedbackIcon} alt="" className='h-8 md:h-14 w-8 md:w-14' /></span> Feedback
        </div>
      </div>
      {activeTab === "reflection" && (
        <div className="p-3 rounded-lg items-center space-y-1">
          <MarkdownRenderer content={children} additionalClass={'text-[#657DFF] italic'} />
          <ImageContainer image={image} color={color} />
        </div>
      )}
      {activeTab === "feedback" && (
        <div className="p-3 rounded-lg items-center space-y-1">
          <MarkdownRenderer content={content2} additionalClass={'text-[#38AFFF] italic'} />
          <ImageContainer image={image2} color={color} />
        </div>
      )}
    </div>
  );
}


export function ReflectionBlock({ content, image, user_has_liked, user_has_recalled, onLikeClick, isAuthenticated, block_id,
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
        CustomContent={ReflectionContent}
        onRecallUpdate={onRecallUpdate}
        content={content}>{content}
      </BlockContainer>
    </div>
  )
}

