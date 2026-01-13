import { BlockContainer } from "./BlockContainer";
import MarkdownRenderer from "../MardownRenderer";
import { ImageContainer } from "./ImageContainer";

const HighlightContent = ({ children, additionalClass, image, color }) => (
  <div
    className={`flex-grow p-2 shadow rounded-2xl border-[5px] ${additionalClass}`}
    style={{ borderColor: color || "#3DB1FF" }}
  >
    <div className="p-3 rounded-lg items-center" style={{
      backgroundColor: `${color || "#3DB1FF"}66`,
    }}>
      <MarkdownRenderer content={children} />
      <ImageContainer image={image} color={color} />
    </div>
  </div>
);


export function HighlightBlock({ content, image, user_has_liked, user_has_recalled, onLikeClick, isAuthenticated, block_id,
  onRecallUpdate, color, isPreview = false, isRecall = false }) {
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
        color={color}
        isPreview={isPreview}
        isRecall={isRecall}
        CustomContent={HighlightContent}
        onRecallUpdate={onRecallUpdate}
        content={content}>{content}
      </BlockContainer>
    </div>
  )
}

