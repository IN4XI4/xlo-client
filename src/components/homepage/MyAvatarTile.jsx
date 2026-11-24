import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

import { getMyAvatar } from '../../api/avatar.api';
import { AvatarRenderer } from '../profile/avatar/AvatarRenderer';

const AVATAR_FETCH_DELAY_MS = 1500;

function AvatarTileSkeleton() {
  return (
    <div className='flex px-3 flex-grow gap-2 animate-pulse'>
      <div className='bg-white/60 rounded-lg p-2'>
        <div className='h-40 w-28 rounded-lg bg-[#B8E3FF]' />
      </div>
      <div className='flex-1 flex flex-col gap-3 pt-1'>
        <div className='h-10 w-20 rounded-lg bg-white/60' />
        <div className='h-10 w-24 rounded-lg bg-white/60' />
        <div className='h-6 w-28 rounded-lg bg-white/60' />
      </div>
    </div>
  );
}


export function MyAvatarTile({ coinBalance, userLevel, activeDays }) {
  const [isOpen, setIsOpen] = useState(true);
  const [myAvatar, setMyAvatar] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(() => {
      getMyAvatar()
        .then(response => { if (!cancelled) setMyAvatar(response.data); })
        .catch(err => { if (!cancelled) setError(err); })
        .finally(() => { if (!cancelled) setIsLoading(false); });
    }, AVATAR_FETCH_DELAY_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);
  const renderAvatar = useMemo(() => myAvatar, [myAvatar]);
  return (
    <div className='h-full flex flex-col'>
      <div className={`bg-[#B8E3FF] rounded-xl p-3 ${isOpen ? "flex-grow flex flex-col" : ""}`}>
        <div className='flex items-center' onClick={() => setIsOpen(!isOpen)}>
          <div className='flex-grow pe-3 cursor-pointer'>
            <div className='text-[#3DB1FF] font-bold md:text-xl xl:text-2xl border-b-2 border-[#3DB1FF]'>
              My avatar
            </div>
            <div className='text-end text-[#3DB1FF] text-sm pb-1'>
              [Follow the progress of your character]
            </div>
          </div>
          <div>
            <div className="text-[#3DB1FF] text-xl cursor-pointer">
              {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
        </div>
        {isOpen && (
          <div className='flex-grow flex flex-col py-2 md:py-0'>
            <div className="flex-grow" />
            <div className='flex items-center justify-center py-3 md:pb-4'>
              {isLoading ? (
                <AvatarTileSkeleton />
              ) : error ? (
                <div className='text-center text-gray-500 text-sm py-6'>Could not load your avatar</div>
              ) : (
                <div className='flex px-3 flex-grow gap-2'>
                  <div className='bg-white rounded-lg p-2'>
                    <AvatarRenderer avatar={renderAvatar} size="h-40" />
                  </div>
                  <div className='flex-1 text-[#3DB1FF] flex flex-col'>
                    <div className='flex items-end'>
                      <div className='text-5xl font-semibold pe-1'>{activeDays != null && activeDays < 10 ? `0${activeDays}` : (activeDays ?? 0)}</div>
                      <div className='text-xs pb-1'>
                        <div>Active</div>
                        <div>days</div>
                      </div>
                    </div>
                    <div className='flex flex-col gap-1'>
                      <div className='flex items-end'>
                        <span className='text-5xl font-semibold'>{coinBalance ?? 0}</span>
                        <span className='text-xs pb-1'>$MXC </span>
                      </div>
                      <div className=''>
                        <span className='text-2xl font-semibold'>{userLevel ?? 'Basic'} </span>
                        <span className='text-xs'>Level</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className='flex justify-end items-end pt-1'>
              <Link to={`/avatar`} className='bg-[#3DB1FF] px-4 py-1 rounded-lg text-white cursor-pointer'
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                SEE MY AVATAR
              </Link>
            </div>
          </div>)}
      </div>
    </div>
  )
}
