import { Link } from 'react-router-dom';
import { CgShapeCircle } from 'react-icons/cg';
import { RiEarthFill } from 'react-icons/ri';
import { FaCommentDots, FaEye, FaThumbsUp, FaUser } from 'react-icons/fa';
import { IoIosSpeedometer } from 'react-icons/io';
import { HoverTooltip } from '../HoverTooltip';
import { flagMap } from '../../globals';

function Tag({ tooltip, className = '', children }) {
  return (
    <HoverTooltip content={tooltip} className={`min-w-0 ${className}`}>
      <div className='flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-black/5 text-gray-600'>
        {children}
      </div>
    </HoverTooltip>
  );
}

export function StoryCard({ story }) {
  return (
    <Link to={`/story/${story.slug}`}
      className={`flex p-2 my-3 min-h-[4.75rem] sm:min-h-[5.5rem] rounded-3xl border ${story.user_has_viewed ? 'bg-white' : 'bg-[#FFCE80]'}`}>
      {story.image && (
        <div className="w-16 h-14 sm:w-24 sm:h-20 flex-shrink-0 overflow-hidden rounded-xl mr-2 self-center">
          <img src={story.image} alt={story.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="w-full overflow-hidden flex flex-col justify-center">
        <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:gap-2">
          <div className="text-sm sm:text-base font-bold leading-tight text-black truncate">{story.title}</div>
          {story.topic_title && (
            <div className="text-gray-500 italic flex-shrink-0 text-sm mb-1 sm:mb-0 pe-1 truncate">
              {story.topic_title}
            </div>
          )}
        </div>
        {story.subtitle && (
          <div className="truncate text-gray-500 text-sm mb-1">{story.subtitle}</div>
        )}
        <div className="flex flex-wrap gap-1">
          {story.difficulty_color && story.difficulty_name && (
            <HoverTooltip content="Difficulty level">
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: story.difficulty_color }}
              >
                <IoIosSpeedometer className="flex-shrink-0" />
                {story.difficulty_name}
              </div>
            </HoverTooltip>
          )}
          {story.owner_name && (
            <Tag tooltip="Created by">
              {story.user_picture
                ? <img src={story.user_picture} className="w-3.5 h-3.5 rounded-full object-cover flex-shrink-0" alt="" />
                : <FaUser className="text-xs flex-shrink-0" />
              }
              <div className="truncate max-w-[7.5rem]">{story.owner_name}</div>
            </Tag>
          )}
          {story.language && (
            <Tag tooltip="Language">
              {flagMap[story.language]
                ? <img src={flagMap[story.language]} className="w-3.5 h-3.5 rounded-full object-cover flex-shrink-0" alt="" />
                : <RiEarthFill className="text-xs flex-shrink-0" />
              }
              {story.language}
            </Tag>
          )}
          <Tag tooltip="Replies" className="hidden md:block">
            <FaCommentDots className="text-xs flex-shrink-0" />
            {story.comments_count ?? 0}
          </Tag>
          <Tag tooltip="Views" className="hidden md:block">
            <FaEye className="text-xs flex-shrink-0" />
            {story.views_count ?? 0}
          </Tag>
          <Tag tooltip="Likes">
            <FaThumbsUp className="text-xs flex-shrink-0" />
            {story.likes_count ?? 0}
          </Tag>
        </div>
      </div>
      <div className="flex flex-col items-center gap-1 justify-center ps-2 pe-1">
        {story.card_colors.slice(0, 4).map((color, colorIndex) => (
          <div key={colorIndex} className="w-4 h-4" style={{ color: color || "#3DB1FF" }}>
            <CgShapeCircle />
          </div>
        ))}
      </div>
    </Link>
  );
}
