import { BlockContainer } from "./BlockContainer";
import MarkdownRenderer from "../MardownRenderer";
import { ImageContainer } from "./ImageContainer";
import { BiSolidQuoteAltLeft } from "react-icons/bi";
import { BiSolidQuoteAltRight } from "react-icons/bi";


const QuoteContent = ({ children, additionalClass, image, authorName, authorPicture }) => (
  <div
    className={`flex-grow shadow rounded-2xl border-[5px] border-[#FFBA0A] ${additionalClass}`}
  >
    <div className="p-3 rounded-lg items-center text-xl bg-[#374151] text-center">
      <div className="flex justify-center text-white text-2xl pb-4">
        <BiSolidQuoteAltLeft />
      </div>
      <MarkdownRenderer content={children} additionalClass="text-xl text-white text-center font-semibold font-serif" />
      <div className="font-serif text-white text-base" style={{ fontWeight: 100 }}>
        <div>---</div>
        <div className="flex justify-center items-center">
          <div>
            {authorName}
          </div>
          {authorPicture &&
            (typeof authorPicture === 'string' || (Array.isArray(authorPicture) && authorPicture.length > 0)) ? (
            <div className='ms-3'>
              <img src={authorPicture} alt="Block"
                className="h-10 w-10 rounded-full border-[#FFBA0A] border-2" />
            </div>
          ) : <></>}
        </div>
      </div>
      <div className="flex justify-center text-white text-2xl pt-4">
        <BiSolidQuoteAltRight />
      </div>
      <ImageContainer image={image} />

    </div>
  </div>
);

export function QuoteBlock({ content, image, color, user_has_liked, user_has_recalled, onLikeClick, isAuthenticated, block_id,
  onRecallUpdate, authorName = null, authorPicture = null, isPreview = false, isRecall = false }) {
  const hasLiked = user_has_liked !== false;

  return (
    <div>
      <BlockContainer color={color}
        CustomContent={QuoteContent}
        hasLiked={hasLiked}
        userHasRecalled={user_has_recalled}
        onLikeClick={onLikeClick}
        isAuthenticated={isAuthenticated}
        block_id={block_id}
        image={image}
        authorName={authorName}
        authorPicture={authorPicture}
        isPreview={isPreview}
        isRecall={isRecall}
        onRecallUpdate={onRecallUpdate}
        content={content}>{content}
      </BlockContainer>
    </div>
  )
}
