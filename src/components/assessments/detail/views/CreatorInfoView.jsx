import { useEffect, useState } from 'react';
import { Tooltip } from 'flowbite-react';
import { FaUser } from 'react-icons/fa';
import { IoMale, IoFemale, IoLogoLinkedin } from 'react-icons/io5';
import { BiWorld } from 'react-icons/bi';
import { getUserModal, getUserBadges } from '../../../../api/users.api';
import { badgeTypeToComponentMap } from '../../../../globals';

function capitalize(text) {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

export function CreatorInfoView({ assessment }) {
  const [user, setUser] = useState(null);
  const [badges, setBadges] = useState([]);
  const userId = assessment?.user;

  useEffect(() => {
    if (!userId) return;
    getUserModal(userId).then(r => setUser(r.data)).catch(() => {});
    getUserBadges(userId).then(r => setBadges(r.data)).catch(() => {});
  }, [userId]);

  if (!user) return null;

  return (
    <div className="py-3 flex flex-col gap-2 text-sm text-gray-500">
      <div className="flex items-center gap-3 pb-2 border-b border-gray-100">
        {user.profile_picture ? (
          <img
            src={user.profile_picture}
            alt=""
            className="w-12 h-12 rounded-full object-cover flex-shrink-0 border-2"
            style={{ borderColor: user.profile_color_value }}
          />
        ) : (
          <div
            className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 border-2"
            style={{ borderColor: user.profile_color_value }}
          >
            <FaUser className="text-gray-400 text-lg" />
          </div>
        )}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1">
            {user.gender === 1 ? <IoMale className="flex-shrink-0" /> : user.gender === 2 ? <IoFemale className="flex-shrink-0" /> : null}
            <span className="font-semibold text-gray-700 truncate">{user.first_name} {user.last_name}</span>
          </div>
          {user.birth_year && <span className="text-xs">{user.birth_year}</span>}
          {user.email && <span className="text-xs truncate">{user.email}</span>}
        </div>
      </div>

      {user.country && (
        <div className="pb-2 border-b border-gray-100">{user.country}</div>
      )}

      {(user.profession || user.experience_value) && (
        <div className="flex flex-col pb-2 border-b border-gray-100">
          {user.profession && <span className="font-semibold text-gray-700">{user.profession}</span>}
          {user.experience_value && <span className="text-xs">{user.experience_value} pro. experience</span>}
        </div>
      )}

      {user.biography && (
        <div className="pb-2 border-b border-gray-100 text-xs leading-relaxed">{user.biography}</div>
      )}

      {(user.linkedin_profile || user.website) && (
        <div className="flex flex-col gap-1 pb-2 border-b border-gray-100">
          {user.linkedin_profile && (
            <div className="flex items-center gap-2 text-xs">
              <IoLogoLinkedin className="flex-shrink-0 text-base" />
              <span className="truncate">{user.linkedin_profile}</span>
            </div>
          )}
          {user.website && (
            <div className="flex items-center gap-2 text-xs">
              <BiWorld className="flex-shrink-0 text-base" />
              <span className="truncate">{user.website}</span>
            </div>
          )}
        </div>
      )}

      {badges.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-gray-600 mb-2">Top badge table</div>
          <div className="flex flex-wrap gap-1">
            {badges.map(badge => {
              const BadgeComponent = badgeTypeToComponentMap[badge.badge_type];
              if (!BadgeComponent) return null;
              const [firstColor, secondColor] = badge.level_colors || ['#FFFFFF', '#000000'];
              return (
                <Tooltip key={badge.id} content={`${badge.level} ${capitalize(badge.badge_type)}`} placement="bottom">
                  <BadgeComponent firstColor={firstColor} secondColor={secondColor} className="h-9 w-9" />
                </Tooltip>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
