import MarkdownRenderer from "../MardownRenderer";
import { BlockContainer } from "./BlockContainer";
import { ImageContainer } from "./ImageContainer";


const IllustrationContent = ({ children, additionalClass, image, color }) => (
  <div
    className={`flex-grow p-2 shadow rounded-2xl border-[5px] ${additionalClass}`} style={{ borderColor: color || "#3DB1FF" }}>
    <div className="p-3 rounded-lg items-center text-xl bg-blue-500">
      <ImageContainer image={image} additionalClass="border-t-0" />
      <MarkdownRenderer content={children} additionalClass="text-lg text-center italic" />
    </div>
  </div>
);


export function IllustrationBlock({ content, image, color, user_has_liked, user_has_recalled, onLikeClick, isAuthenticated, block_id,
  onRecallUpdate, isPreview = false, isRecall = false }) {
  const hasLiked = user_has_liked !== false;
  return (
    <div>
      <BlockContainer color={color}
        hasLiked={hasLiked}
        userHasRecalled={user_has_recalled}
        onLikeClick={onLikeClick}
        isAuthenticated={isAuthenticated}
        block_id={block_id}
        image={image}
        isPreview={isPreview}
        isRecall={isRecall}
        onRecallUpdate={onRecallUpdate}
        content={content}
        CustomContent={IllustrationContent}>
          {content}
      </BlockContainer>
    </div>
  )
}

