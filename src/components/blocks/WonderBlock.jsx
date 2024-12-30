import { BlockContainer } from "./BlockContainer";
import MarkdownRenderer from "../MardownRenderer";
import { ImageContainer } from "./ImageContainer";
import WonderIcon from "../../assets/wonder.svg"

const WonderContent = ({ children, additionalClass, image, blockTitle }) => (
  <div
    className={`flex-grow p-2 shadow rounded-2xl border-[5px] ${additionalClass}`}
    style={{
      borderColor: "#B7880E",
    }}
  >
    <div className="p-2 rounded-lg items-center text-xl">
      <div className="flex justify-center">
        <img src={WonderIcon} alt="" className='h-6 md:h-8' />
      </div>
      <div className="flex justify-center text-[#6A4E04] uppercase py-3 font-semibold">
        {blockTitle}
      </div>
      <ImageContainer image={image} additionalClass="border-[#D6BF8E] flex justify-center" 
      additionalClassImg="rounded-none max-h-[800px]"/>
      <div className="bg-[#D6BF8E] p-2 rounded-b-lg min-h-[5rem]">
        <MarkdownRenderer content={children} additionalClass="text-lg text-[#4A3809]" />
      </div>
    </div>
  </div>
);


export function WonderBlock({ content, image, color, user_has_liked, user_has_recalled, onLikeClick, isAuthenticated, block_id,
  onRecallUpdate, blockTitle, isPreview = false, isRecall = false }) {
  const hasLiked = user_has_liked !== false;
  return (
    <div>
      <BlockContainer color={color}
        hasLiked={hasLiked}
        userHasRecalled={user_has_recalled}
        onLikeClick={onLikeClick}
        isAuthenticated={isAuthenticated}
        block_id={block_id}
        blockTitle={blockTitle}
        image={image}
        isPreview={isPreview}
        isRecall={isRecall}
        onRecallUpdate={onRecallUpdate}
        CustomContent={WonderContent}
        content={content}>{content}
      </BlockContainer>
    </div>
  )
}

