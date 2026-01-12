import { useEffect, useState } from "react";
import { BlockContainer } from "./BlockContainer";
import MarkdownRenderer from "../MardownRenderer";
import { ImageContainer } from "./ImageContainer";
import { FaUser } from "react-icons/fa6";
import { AvatarRenderer } from "../profile/avatar/AvatarRenderer";
import { getMyAvatar } from "../../api/avatar.api";


const HeroContent = ({ children, color, additionalClass, image, ownerAvatar }) => (
  <div
    className={`flex-grow items-center p-4 bg-gray-50 shadow rounded-2xl border-[4px] ${additionalClass}`}
    style={{ borderColor: color || "#3DB1FF" }}
  >
    <div className="flex items-center pb-2">
      {ownerAvatar ? (
        <div className='flex-shrink-0 pe-3'>
          <AvatarRenderer avatar={ownerAvatar} size="h-40" />
        </div>
      ) : <div className="flex-shrink-0 pe-3">
        <div className="rounded-full h-16 w-16 md:h-20 md:w-20 flex items-center bg-gray-200 justify-center">
          <FaUser className="text-white" />
        </div>
      </div>
      }
      <MarkdownRenderer content={children} />
    </div>
    <ImageContainer image={image} color={color} />
  </div>
);

export function HeroBlock({ content, image, color, user_has_liked, user_has_recalled, onLikeClick, isAuthenticated, block_id,
  onRecallUpdate, ownerAvatar, isPreview = false, isRecall = false }) {
  const hasLiked = user_has_liked !== false;
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    loadAvatar();
  }, []);

  async function loadAvatar() {
    try {
      const response = await getMyAvatar();
      setAvatar(response.data);
    } catch (e) {
      console.error("Error loading avatar", e);
    }
  }

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
        ownerAvatar={avatar}
        onRecallUpdate={onRecallUpdate}
        CustomContent={HeroContent}
        content={content}>{content}
      </BlockContainer>
    </div>
  )
}

