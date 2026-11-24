import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FaUsers } from 'react-icons/fa';

import { getMySpaces } from '../../api/spaces.api';
import { useSpace } from '../../context/SpaceContext';
import { RocketIcon } from '../illustrations/icons/RocketIcon';

const GRID_SLOTS = 4;

const roleInfo = {
  owner: { text: 'Owner', color: 'text-[#9B51E0]' },
  admin: { text: 'Admin', color: 'text-[#5B0FFE]' },
  member: { text: 'Member', color: 'text-[#3DB1FF]' }
};

function SpaceCard({ space, isActive }) {
  const role = space.is_owner ? 'owner' : space.is_admin ? 'admin' : 'member';

  return (
    <Link to={`/spaces/${space.slug}`}
      className={`bg-[#FBF3D9] rounded-xl p-2 flex flex-col items-center min-w-0
        ${isActive ? 'ring-2 ring-[#3DB1FF]' : ''}`}>
      {space.image ? (
        <img src={space.image} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
      ) : (
        <RocketIcon color={space.color_name} className="w-10 h-10 flex-shrink-0" />
      )}
      <div className="w-full text-center font-semibold text-sm text-gray-600 truncate pt-1">{space.name}</div>
      <div className="flex items-center gap-2 text-xs">
        <span className={`font-semibold ${roleInfo[role].color}`}>{roleInfo[role].text}</span>
        {space.members_count != null && (
          <span className="flex items-center gap-1 text-gray-400">
            <FaUsers />{space.members_count}
          </span>
        )}
      </div>
    </Link>
  );
}

function SpaceCardSkeleton() {
  return (
    <div className="bg-[#FBF3D9] rounded-xl p-2 flex flex-col items-center gap-1.5 animate-pulse">
      <div className="w-10 h-10 rounded-full bg-[#F0DEA4]" />
      <div className="h-3.5 w-3/4 rounded-full bg-[#F0DEA4]" />
      <div className="h-3 w-1/2 rounded-full bg-[#F0DEA4]" />
    </div>
  );
}

export function MySpacesTile() {
  const [isOpen, setIsOpen] = useState(true);
  const { activeSpace } = useSpace();
  const [mySpaces, setMySpaces] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getMySpaces()
      .then(response => { if (!cancelled) setMySpaces(response.data); })
      .catch(err => { if (!cancelled) setError(err); })
      .finally(() => { if (!cancelled) setIsLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid grid-cols-2 gap-2">
          {Array.from({ length: GRID_SLOTS }).map((_, i) => <SpaceCardSkeleton key={i} />)}
        </div>
      );
    }
    if (error) {
      return <div className="text-center text-gray-500 text-sm py-6">Could not load your spaces</div>;
    }
    if (mySpaces.length === 0) {
      return (
        <div className="flex flex-col items-center text-center py-6 px-2">
          <RocketIcon color="#6B7280" className="w-14 h-14" />
          <div className="text-gray-500 font-semibold text-sm pt-2">You don&apos;t have any spaces yet</div>
          <div className="text-gray-400 text-xs pt-1">Join or create one to explore content together.</div>
        </div>
      );
    }

    const sorted = [...mySpaces].sort((a, b) => (b.id == activeSpace?.id) - (a.id == activeSpace?.id));
    const overflow = sorted.length > GRID_SLOTS;
    const visible = overflow ? sorted.slice(0, GRID_SLOTS - 1) : sorted;

    return (
      <div className="grid grid-cols-2 gap-2">
        {visible.map(space => (
          <SpaceCard key={space.id} space={space} isActive={space.id == activeSpace?.id} />
        ))}
        {overflow && (
          <Link to="/spaces" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-[#FBF3D9] rounded-xl p-2 flex items-center justify-center text-[#D6A400] font-semibold text-sm">
            +{sorted.length - visible.length} more
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className='h-full flex flex-col'>
      <div className={`bg-[#F0DEA4] rounded-xl p-3 ${isOpen ? "flex-grow flex flex-col" : ""}`}>
        <div className='flex items-center' onClick={() => setIsOpen(!isOpen)}>
          <div className='flex-grow pe-3 cursor-pointer'>
            <div className='text-[#D6A400] font-bold md:text-xl xl:text-2xl border-b-2 border-[#D6A400]'>
              My spaces
            </div>
            <div className='text-end text-[#D6A400] text-sm pb-1'>
              [Active a space and explore content]
            </div>
          </div>
          <div>
            <div className="text-[#D6A400] text-xl cursor-pointer">
              {isOpen ? <FiChevronUp /> : <FiChevronDown />}
            </div>
          </div>
        </div>
        {isOpen && (
          <div className='flex-grow flex flex-col'>
            <div className="flex-grow pt-2 pb-1 flex flex-col justify-center">
              {renderContent()}
            </div>
            <div className='flex justify-center pt-1'>
              <Link to={`/spaces`} className='bg-[#D6A400] text-white uppercase text-sm tracking-wide rounded-full px-8 py-2 hover:bg-[#B88D00]'
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Enter to spaces
              </Link>
            </div>
          </div>)}
      </div>
    </div>
  )
}
