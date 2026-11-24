import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { FiEdit2, FiShare2 } from 'react-icons/fi';

import { HoverTooltip } from '../HoverTooltip';
import { LevelProgressCard } from './LevelProgressCard';
import { formatNumber } from './formatNumber';

function Count({ value, label }) {
  return (
    <div className="text-center sm:text-left">
      <span className="block sm:inline text-base sm:text-[17px] font-bold text-gray-900 tabular-nums">
        {formatNumber(value)}
      </span>
      <span className="block sm:inline sm:ms-1 text-[11px] sm:text-sm text-gray-500">{label}</span>
    </div>
  );
}

// Top card of the public profile. The backend already trims the fields per viewer;
// the flags only decide which blocks are rendered.
export function ProfileHeader({ profile, isAuthenticated, isOwner }) {
  const [copied, setCopied] = useState(false);
  const fullName = `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim();
  const joined = profile.date_joined
    ? new Date(profile.date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : null;
  const levelProgress = isAuthenticated ? profile.level_progress : null;

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      // Clipboard unavailable (e.g. insecure context): nothing to do
    }
  }

  return (
    <div className="relative bg-white border border-gray-200 rounded-2xl shadow-sm p-4 sm:p-6 lg:p-7">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:top-7 lg:right-7 flex gap-2">
        {isOwner && (
          <HoverTooltip content="Edit profile">
            <Link to="/profile/" aria-label="Edit profile"
              className="h-9 w-9 flex items-center justify-center rounded-full bg-[#3DB1FF] text-white hover:bg-[#2BA0EE]">
              <FiEdit2 />
            </Link>
          </HoverTooltip>
        )}
        <HoverTooltip content={copied ? 'Link copied' : 'Share profile'}>
          <button type="button" onClick={handleShare} aria-label="Share profile"
            className="h-9 w-9 flex items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 hover:border-[#3DB1FF] hover:text-[#3DB1FF]">
            <FiShare2 />
          </button>
        </HoverTooltip>
      </div>

      <div className="flex flex-col md:flex-row md:items-start gap-5 md:gap-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 sm:gap-4 pe-20">
            {profile.profile_picture ? (
              <img src={profile.profile_picture} alt={fullName}
                className="h-14 w-14 sm:h-[72px] sm:w-[72px] flex-shrink-0 rounded-full object-cover border-[3px] border-white ring-2 ring-[#3DB1FF]" />
            ) : (
              <div className="h-14 w-14 sm:h-[72px] sm:w-[72px] flex-shrink-0 rounded-full border-[3px] border-white ring-2 ring-[#3DB1FF] bg-gray-200 text-gray-400 text-xl sm:text-2xl flex items-center justify-center">
                <FaUser />
              </div>
            )}
            <div className="min-w-0">
              <div className="text-xl sm:text-2xl font-extrabold tracking-tight leading-tight text-gray-900 break-words">
                {fullName}
              </div>
              {profile.profession && (
                <div className="text-xs sm:text-sm text-gray-500 truncate">{profile.profession}</div>
              )}
              {levelProgress && (
                <div className="mt-2 flex">
                  <span className="rounded-full bg-[#E3F4FF] px-2 py-px text-[11px] font-semibold text-[#0A74BD]">
                    {levelProgress.level_name}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-600">
            {profile.country && <span>{profile.country}</span>}
            {joined && <span>Joined {joined}</span>}
            {isOwner && <span className="tabular-nums">{formatNumber(profile.coin_balance)} coins</span>}
          </div>

          <div className={`mt-3 sm:mt-4 grid ${isOwner ? 'grid-cols-5' : 'grid-cols-3'} gap-1 border-y border-gray-200 py-2.5
            sm:flex sm:flex-wrap sm:gap-x-6 sm:gap-y-1 sm:border-0 sm:py-0`}>
            <Count value={profile.followers_count} label="Followers" />
            <Count value={profile.following_count} label="Following" />
            <Count value={profile.stories_count} label="Stories" />
            {isOwner && <Count value={profile.attempts_count} label="Attempts" />}
            {isOwner && <Count value={profile.spaces_count} label="Spaces" />}
          </div>
        </div>

        {levelProgress && (
          <div className="w-full md:w-[300px] lg:w-[340px] flex-shrink-0 md:pt-12">
            <LevelProgressCard levelProgress={levelProgress} />
          </div>
        )}
      </div>
    </div>
  );
}
